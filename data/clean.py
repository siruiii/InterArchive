import json

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

def remove_duplicates_by_project_and_venue(data):
    seen = {}
    cleaned_data = []

    for item in data:
        project_id = item.get("project_id")
        venue_id = item.get("venue_id")
        key = (project_id, venue_id)

        if project_id is None:
            # If project_id is None, keep it since we can't compare
            cleaned_data.append(item)
            continue

        if key not in seen:
            seen[key] = True
            cleaned_data.append(item)
        else:
            print(f"Duplicate found and removed for project_id: {project_id}, venue_id: {venue_id}")

    return cleaned_data

def save_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)

if __name__ == "__main__":
    input_file = "projectJSONs.json"  # your input JSON file
    output_file = "projectJSONs_cleaned.json"

    data = load_json(input_file)
    cleaned_data = remove_duplicates_by_project_and_venue(data)
    save_json(cleaned_data, output_file)

    print(f"Original entries: {len(data)}")
    print(f"Cleaned entries: {len(cleaned_data)}")
