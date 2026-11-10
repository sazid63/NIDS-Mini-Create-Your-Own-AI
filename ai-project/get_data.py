# get_data.py -- download the real traffic records (about 370 MB, one time only)
#
# The records come from CIC-IDS2017, a public "practice network" built by the
# Canadian Institute for Cybersecurity. Real attacks were launched against it
# for five days while every connection was written down as one row.

# ▶ PART 1: Bring in the downloader
from huggingface_hub import hf_hub_download

# ▶ PART 2: Say where the file lives and where to keep it
REPO = "rdpahalavan/CIC-IDS2017"          # the online shelf that stores the file
FILE = "Network-Flows/CICIDS_Flow.parquet"  # the exact file we want

# ▶ PART 3: Download it into the data/ folder
path = hf_hub_download(repo_id=REPO, filename=FILE, repo_type="dataset", local_dir="data")
print("Saved to:", path)
