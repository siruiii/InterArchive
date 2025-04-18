import json
from collections import Counter
from pathlib import Path

# === SET THIS VARIABLE ===
# Field path you want to extract (e.g., "users.user_name", "instructors", "classes.class_name")
field_path = "project_id"

# === Load JSON file ===
with open("decoded_cleaned_projects.json", "r") as f:
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
    all_values.extend(values)

counter = Counter(all_values)

# === Format as dictionary: {value: count} ===
unique_value_counts = dict(counter)

# === Save to JSON file ===
output_path = Path("unique_value_counts.json")
with open(output_path, "w") as f:
    json.dump(unique_value_counts, f, indent=4)

# === Print only the number of unique values ===
print(f"Found {len(unique_value_counts)} unique values for '{field_path}'.")
print(f"Saved detailed counts to: {output_path.resolve()}")
