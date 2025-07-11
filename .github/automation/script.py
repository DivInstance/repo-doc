import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import json
import sys
from collections import Counter
from statistics import mean

load_dotenv()

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
resb = requests.get(stale_url, headers=headers).json()
resc = requests.get(commit_url, headers=headers).json()

if("message" in resb):
    print(resb["message"])
    sys.exit()
    
activity_chart = []
stale = []
file_added = []

for b in resb:
    branch = b["name"]
    commit_url = b["commit"]["url"]
    commit = requests.get(commit_url, headers=headers).json()
    date = commit["commit"]["committer"]["date"]
    dt = datetime.fromisoformat(date[:-1])
    files = commit["files"]            

    branch_info = {
        "branch": branch,
        "author": commit["commit"]["author"]["name"],
        "date": dt.strftime("%Y-%m-%d"),
        "message": commit["commit"]["message"],
        "days_inactive": f"{(datetime.now() - dt).days} days",
        "last_commit": ((datetime.now() - dt).total_seconds() // 3600.0),
        "commits": f"{len(resc)} commits"
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


print(stale_report)


#_________________________________________________________________________________________________#

"""
Task 2 - Identify all PRs and list reviewers

Fetch all pull requests and include their metadata for JSON output.
"""

pr_url = f"https://api.github.com/repos/{owner}/{repo_name}/pulls?state=open&per_page=100"
resp = requests.get(pr_url, headers=headers).json()
prs = []

for pr in resp:
    created_at = datetime.fromisoformat(pr["created_at"][:-1])

    pr_data = {
        "title": pr["title"],
        "number": pr["number"],
        "created_at": created_at.strftime("%Y-%m-%d"),
        "days_active": (datetime.now()-created_at).days,
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
        f"Days Active: {pr['days_active']}\n"
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
contributors_url = f"https://api.github.com/repos/{owner}/{repo_name}/contributors"
res = requests.get(repo_url, headers=headers).json()
contributors = requests.get(contributors_url,headers=headers).json()

repo_info = {
    "name": res["name"],
    "owner": res["owner"]["login"],
    "description": res["description"],
    "created_at": res["created_at"],
    "updated_at": res["updated_at"],
    "pushed_at": res["pushed_at"],
    "language": res["language"],
    "default_branch": res["default_branch"],
    "visibility": res["visibility"],
    "forks_count": res["forks_count"],
    "open_issues_count": res["open_issues_count"],
    "license":res["license"],
    "contributors": [r["login"] for r in contributors]
    
}

repo_info_report = (
    f"Name: {repo_info['name']}\n"
    f"Owner: {repo_info['owner']}\n"
    f"Description: {repo_info['description']}\n"
    f"Created At: {repo_info['created_at']}\n"
    f"Updated At: {repo_info['updated_at']}\n"
    f"Pushed At: {repo_info['pushed_at']}\n"
    f"Language: {repo_info['language']}\n"
    f"Default Branch: {repo_info['default_branch']}\n"
    f"Visibility: {repo_info['visibility']}\n"
    f"Forks: {repo_info['forks_count']}\n"
    f"Open Issues: {repo_info['open_issues_count']}\n"
    f"License: {repo_info['license']}\n"
    f"Contributors: {repo_info['contributors']}\n"
    
)

repo_info = [repo_info]

print("Repository Information",repo_info_report)


#_________________________________________________________________________________________________#

"""
Activity Chart
"""
commits_per_month = {}
commit_days = []
commit_hours = []

now = datetime.now()
months = [(now - relativedelta(months=i)).strftime("%Y-%m") for i in range(5, -1, -1)]

commits_by_month = {month: 0 for month in months}
branches_by_month = {month: 0 for month in months}
prs_by_month = {month: 0 for month in months}

for commit in resc:
    date_str = commit["commit"]["committer"]["date"]
    commit_date = datetime.fromisoformat(date_str[:-1])
    month = commit_date.strftime("%Y-%m")
    if month in commits_by_month:
        commits_by_month[month] += 1

for b in resb:
    commit_url = b["commit"]["url"]
    commit = requests.get(commit_url, headers=headers).json()
    date_str = commit["commit"]["committer"]["date"]
    dt = datetime.fromisoformat(date_str[:-1])
    month = dt.strftime("%Y-%m")
    
    commits_per_month[month] = commits_per_month.get(month, 0) + 1
    weekday = commit_date.strftime("%A")
    commit_days.append(weekday)
    commit_hours.append(commit_date.hour) 
    
    if month in branches_by_month:
        branches_by_month[month] += 1
        
for pr in resp:
    created_at = datetime.fromisoformat(pr["created_at"][:-1])
    month = created_at.strftime("%Y-%m")
    if month in prs_by_month:
        prs_by_month[month] += 1
        
average_commits = round(mean(commits_per_month.values()), 2)
most_active_day = Counter(commit_days).most_common(1)[0][0]
hour_counts = Counter(commit_hours)
most_common_hour = hour_counts.most_common(1)[0][0]

def hour_to_range(hour):
    end = (hour + 2) % 24
    suffix = "AM" if hour < 12 else "PM"
    end_suffix = "AM" if end < 12 else "PM"
    return f"{hour % 12 or 12}–{end % 12 or 12} {suffix if suffix == end_suffix else suffix + '/' + end_suffix}"

peak_hours = hour_to_range(most_common_hour)


def calculate_repository_health(
    avg_commits_per_month,
    total_branches,
    stale_branches,
    total_prs,
    old_prs,
    total_issues=None,
    slow_issues=None,
    contributors_count=None ):
    
    cfs = min((avg_commits_per_month / 20) * 100, 100) # Commit Frequency Score (30%)
    
    if total_branches == 0: # Branch Hygiene Score (25%)
        bhs = 100
    else:
        active_branches = total_branches - stale_branches
        bhs = (active_branches / total_branches) * 100

    if total_prs == 0:     # PR Velocity Score (25%)
        prs = 100
    else:
        prs = ((total_prs - old_prs) / total_prs) * 100

    if total_issues is not None and slow_issues is not None:  # Issue Responsiveness Score (10%) - optional
        if total_issues == 0:
            irs = 100
        else:
            fast_issues = total_issues - slow_issues
            irs = (fast_issues / total_issues) * 100
    else:
        irs = 100  # Assume good if not tracked

    if contributors_count is not None:     # Contributor Diversity Score (10%)
        cds = min((contributors_count / 5) * 100, 100)  # 5+ contributors = max score
    else:
        cds = 100

    total_score = ( 0.30 * cfs + 0.25 * bhs + 0.25 * prs + 0.10 * irs + 0.10 * cds) # Weighted Total Score
    return round(total_score, 2)

# Calculating health score  
old_prs = [pr for pr in prs if pr["days_active"] >= 7]
issues_url = f"https://api.github.com/repos/{owner}/{repo_name}/issues?state=all&per_page=100"
resi = requests.get(issues_url, headers=headers).json()
slow_issue_threshold_days = 7
slow_issues_count = 0
for issue in resi:
    if "pull_request" in issue:
        continue  # Skip pull requests
    created = datetime.fromisoformat(issue["created_at"][:-1])
    closed_at = issue.get("closed_at")
    if closed_at:
        closed = datetime.fromisoformat(closed_at[:-1])
        open_duration = (closed - created).days
    else:
        open_duration = (datetime.now() - created).days
    if open_duration >= slow_issue_threshold_days:
        slow_issues_count += 1
        
repo_health_score = calculate_repository_health(average_commits,len(resb),len(stale),len(resp),len(old_prs),res["open_issues_count"],slow_issues_count,len(contributors))


monthly_activity = {
    "commits": commits_by_month,
    "branches": branches_by_month,
    "prs": prs_by_month
}

monthly_activity_report = (
    f"Monthly commits: {monthly_activity['commits']}\n"
    f"Branches created per month: {monthly_activity['branches']}\n"
    f"Prs opened per month: {monthly_activity['prs']}\n"
)

analytics = {
    "average_commits_per_month": average_commits,
    "most_active_day": most_active_day,
    "peak_hours": peak_hours,
    "repo_health_score": repo_health_score
}

analytics_report = (
    f"Average commits per month: {analytics['average_commits_per_month']}\n"
    f"Most active day: {analytics['most_active_day']}\n"
    f"Peak hours: {analytics['peak_hours']}\n"
    f"Repository health score: {analytics['repo_health_score']}\n"
)

print("Monthly Activity Report\n", monthly_activity_report)
print("Analytics\n",analytics_report)


#_________________________________________________________________________________________________#

"""
Task 3 - Save the data to a JSON files for visualization
"""

output = {
    "stale_branches": stale,  
    "open_prs": prs,          
    "repo_info": [repo_info],
    "monthly_activity": monthly_activity,
    "analytics": analytics
}

with open("data.json", "w") as f:
    json.dump(output, f, indent=4)

#_________________________________________________________________________________________________#