import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta
import json

load_dotenv()

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

repo = os.getenv("GITHUB_REPOSITORY")
token = os.getenv("GITHUB_TOKEN")


a = repo.split("/")
owner,repo_name = a[-2],a[-1]

if(token):
    headers = {"Authorization": f"Bearer {token}"}
else:
    headers = {}

""" 
Task 1 - Identifying Stale Repo 

A1: Identify stale branches (no commits in last 30 days).
Queries the GitHub API to fetch branch data and identifies branches 
without commits in the specified period.

"""
   
stale_url = f"https://api.github.com/repos/{owner}/{repo_name}/branches"
commit_url = f"https://api.github.com/repos/{owner}/{repo_name}/commits?per_page=100"
res = requests.get(stale_url, headers=headers).json()
resc = requests.get(commit_url, headers=headers).json()

activity_chart = []
stale = []
file_added = []

commits_by_month = [0] * 12
branchesCreated_by_month = [0] * 12
prsOpened_by_month = [0] * 12


for b in res:
    branch = b["name"]
    commit_url = b["commit"]["url"]
    commit = requests.get(commit_url, headers=headers).json()
    date = commit["commit"]["committer"]["date"]
    dt = datetime.fromisoformat(date[:-1])
    commit_month = datetime.fromisoformat(date[:-1]).month - 1
    commits_by_month[commit_month] += 1
    files = commit["files"]            

    branch_info = {
        "branch": branch,
        "author": commit["commit"]["author"]["name"],
        "date": dt.strftime("%Y-%m-%d"),
        "message": commit["commit"]["message"],
        "days_inactive": f"{(datetime.now() - dt).days} days",
        "last_commit": ((datetime.now() - dt).total_seconds() // 3600.0),
        "commits": f"{len(resc)} commits",
        "commits_by_month": f"{commits_by_month}"
        }

    stale.append(branch_info)


stale_report = "Stale Branches:\n"
for s in stale:
    stale_report += (
        f"\nBranch: {s['branch']}\n"
        f"Author: {s['author']}\n"
        f"Date: {s['date']}\n"
        f"Message: {s['message']}\n"
        f"Inactive Days: {s['days_inactive']}\n"
        f"Last Commit: {s['last_commit']} hrs ago\n"
        f"Total Commits: {s['commits']}\n"       
    ) 

activity_chart.append(commits_by_month)


print(stale_report)


#_________________________________________________________________________________________________#

"""
Task 2 - Identify all PRs and list reviewers

Fetch all pull requests and include their metadata for JSON output.
"""

pr_url = f"https://api.github.com/repos/{owner}/{repo_name}/pulls?state=open&per_page=100"
res = requests.get(pr_url, headers=headers).json()
prs = []

for pr in res:
    created_at = datetime.fromisoformat(pr["created_at"][:-1])

    pr_data = {
        "title": pr["title"],
        "number": pr["number"],
        "created_at": created_at.strftime("%Y-%m-%d"),
        "number": pr["number"],
        "creater": pr["user"]["login"],
        "state": pr["state"],
        "url": pr["html_url"],
        "reviewers": [r["login"] for r in pr.get("requested_reviewers", [])]
    }

    prs.append(pr_data)

# Optional: Print report
pr_report = "All Pull Requests:\n"
for pr in prs:
    pr_report += (
        f"\nTitle: {pr['title']}\n"
        f"Created At: {pr['created_at']}\n"
        f"Number: {pr['number']}\n"
        f"Creater: {pr['creater']}\n"
        f"State: {pr['state']}\n"
        f"URL: {pr['url']}\n"
        f"Reviewers: {', '.join(pr['reviewers']) if pr['reviewers'] else 'None'}\n"
    )

print(pr_report)
#_________________________________________________________________________________________________#

"""
Additional - Repository Information and analytics
"""     

repo_url = f"https://api.github.com/repos/{owner}/{repo_name}"
res = requests.get(repo_url, headers=headers).json()

repo_info = {
    "name": res["name"],
    "owner": res["owner"]["login"],
    "description": res["description"],
    "created_at": res["created_at"],
    "updated_at": res["updated_at"],
    "language": res["language"],
    "default_branch": res["default_branch"],
    "visibility": res["visibility"],
    "forks_count": res["forks_count"],
    "open_issues_count": res["open_issues_count"],
}

repo_info_report = (
    f"Name: {repo_info['name']}\n"
    f"Owner: {repo_info['owner']}\n"
    f"Description: {repo_info['description']}\n"
    f"Created At: {repo_info['created_at']}\n"
    f"Updated At: {repo_info['updated_at']}\n"
    f"Language: {repo_info['language']}\n"
    f"Default Branch: {repo_info['default_branch']}\n"
    f"Visibility: {repo_info['visibility']}\n"
    f"Forks: {repo_info['forks_count']}\n"
    f"Open Issues: {repo_info['open_issues_count']}\n"
)

print("Repository Information",repo_info_report)

#_________________________________________________________________________________________________#

"""
Task 3 - Save the data to a JSON files for visualization
"""

output = {
    "stale_branches": stale,  
    "open_prs": prs,          
    "repo_info": [repo_info]
}

with open("data.json", "w") as f:
    json.dump(output, f, indent=4)

#_________________________________________________________________________________________________#