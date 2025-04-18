import json

# Example JSON input (you can load from file too)
with open("projects.json", "r") as f:
    data = json.load(f)

# List of fields to remove from each object
fields_to_remove = [
    "_id", "position_id", "room_id", "sustain", "thesis_slides", "thesis_tags",
    "x_norm", "y_norm", "w_norm", "h_norm","timestamp"
]

# Function to clean each project dict
def clean_project(project, fields_to_remove):
    return {k: v for k, v in project.items() if k not in fields_to_remove}

# If it's a list of projects
if isinstance(data, list):
    cleaned_data = [clean_project(project, fields_to_remove) for project in data]
else:
    cleaned_data = clean_project(data, fields_to_remove)

# Save the cleaned data
with open("cleaned_data.json", "w") as f:
    json.dump(cleaned_data, f, indent=4)

print("Fields removed and data saved to cleaned_data.json")
