import csv
import json
import os
import random

def paginate_csv_to_json(csv_file, page_size, output_directory, seed):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    with open(csv_file, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        rows = list(csv_reader)
        random.seed(seed)
        random.shuffle(rows)

        num_pages = len(rows) // page_size + (1 if len(rows) % page_size != 0 else 0)

        for page_num in range(num_pages):
            page_data = rows[page_num * page_size: (page_num + 1) * page_size]

            output_file_path = os.path.join(output_directory, f'page_{page_num + 1}.json')
            with open(output_file_path, 'w') as json_file:
                json.dump(page_data, json_file, indent=4)

            print(f"Page {page_num + 1} written to {output_file_path}")

# Example usage
csv_file = 'filtered_articles.csv'  # Your CSV file
page_size = 80  # Number of rows per page
output_directory = 'output_json'  # Directory to store JSON files
seed = 42  # Fixed seed for reproducibility

paginate_csv_to_json(csv_file, page_size, output_directory, seed)
