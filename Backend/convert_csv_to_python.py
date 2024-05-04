import csv
import json
import os

def paginate_csv_to_json(csv_file, page_size, output_directory):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    with open(csv_file, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        total_rows = sum(1 for row in csv_reader)

        # Reset csv reader
        csv_file.seek(0)
        csv_reader = csv.DictReader(csv_file)

        num_pages = total_rows // page_size + (1 if total_rows % page_size != 0 else 0)

        for page_num in range(num_pages):
            page_data = []
            for _ in range(page_size):
                try:
                    row = next(csv_reader)
                    page_data.append(row)
                except StopIteration:
                    break

            output_file_path = os.path.join(output_directory, f'page_{page_num + 1}.json')
            with open(output_file_path, 'w') as json_file:
                json.dump(page_data, json_file, indent=4)

            print(f"Page {page_num + 1} written to {output_file_path}")

# Example usage
csv_file = 'articles.csv'  # Your CSV file
page_size = 80  # Number of rows per page
output_directory = 'output_json'  # Directory to store JSON files

paginate_csv_to_json(csv_file, page_size, output_directory)