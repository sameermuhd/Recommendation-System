import os
import pandas as pd

# Path to your CSV file and image folder
csv_file = 'articles.csv'
image_folder = 'product-images'

# Read the CSV file into a DataFrame
df = pd.read_csv(csv_file)
original_size = len(df)

# Get a list of all image filenames in the folder
image_files = os.listdir(image_folder)

# Extract article_id from filenames
image_article_ids = [filename.lstrip('0').split('.')[0] for filename in image_files]

# Filter DataFrame to only keep rows with article_id that have corresponding images
df = df[df['article_id'].astype(str).isin(image_article_ids)]

# Write the filtered DataFrame to a new CSV file
filtered_csv_file = 'filtered_' + csv_file
df.to_csv(filtered_csv_file, index=False)

# Calculate how many rows have been removed
rows_removed = original_size - len(image_article_ids)

print(f"Number of rows removed: {rows_removed}")
