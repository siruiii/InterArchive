import json
from collections import Counter
from pathlib import Path

# === SET THIS VARIABLE ===
field_path = "keywords"  # e.g., "keywords", "users.user_name", etc.
split_on_comma = field_path == "keywords"  # Automatically split for keywords

# === Load JSON file ===
with open("cleaned_data.json", "r") as f:
    data = json.load(f)

# Ensure data is a list of objects
if not isinstance(data, list):
    data = [data]

# === Helper function to extract nested values ===
def extract_values(obj, path):
    keys = path.split('.')
    values = [obj]
    for key in keys:
        temp = []
        for val in values:
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, dict) and key in item:
                        temp.append(item[key])
            elif isinstance(val, dict) and key in val:
                temp.append(val[key])
        values = temp
    return values

# === Extract and count unique values ===
all_values = []
for item in data:
    values = extract_values(item, field_path)
    if split_on_comma:
        # Split on comma, strip whitespace, and ignore empty strings
        split_values = []
        for val in values:
            if isinstance(val, str):
                split_values.extend([v.strip() for v in val.split(",") if v.strip()])
        values = split_values
    all_values.extend(values)

counter = Counter(all_values)
unique_value_counts = dict(counter)

# === Save to JSON file ===
output_path = Path("unique_value_counts.json")
with open(output_path, "w") as f:
    json.dump(unique_value_counts, f, indent=4)

# === Print only the number of unique values ===
print(f"Found {len(unique_value_counts)} unique values for '{field_path}'.")
print(f"Saved detailed counts to: {output_path.resolve()}")
