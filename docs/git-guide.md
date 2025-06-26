# git-guide

1. **Cloning Repositories:** `git clone <url>` or `gh repo clone <username>/<repo_name>`

2. **FIRST Push into Repo:** `git push -u origin <branch_name>`
- you *must* include the `-u` for your first push to the repository or else we will run into `git pull` issues. Every other push to the repository afterwards, you can *omit* `-u`

3. **Switching Branhes:**
    * `git switch <branch_name>`
    * `git checkout <branch_name>`
    * `git checkout -b <branch_name>` << this creates and switches you to the newly created branch

4. **Merging Branches:** TBA soon