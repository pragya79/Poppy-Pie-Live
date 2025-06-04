# Example User Input
user_input = "I'm searching for top-tier fintech and cybersecurity firms that specialize in blockchain solutions. Preferably large corporations. "

matching_industries = find_best_matching_industry(user_input)

company_size = find_company_size_sbert(user_input)

# Print results
print("\nUser Input:", user_input)
print("Best Matching Industries:", matching_industries)
print("Targeted Company Size:", company_size)

def find_relevant_companies(matching_industries, company_size, output_filename="relevant_companies1.csv"):
    """
    Filters the dataset to find relevant companies and saves them as a CSV file.

    Parameters:
    - matching_industries: List of extracted industries
    - company_size: Extracted company size (either '51-200', '10001+', or 'Not specified')
    - output_filename: Name of the output CSV file (default: "relevant_companies.csv")

    Returns:
    - Saves the filtered DataFrame as a CSV file and returns the DataFrame.
    """
    filtered_df = df[df["industry"].isin(matching_industries)]
    if company_size != "Not specified":
        filtered_df = filtered_df[filtered_df["size range"] == company_size]
    filtered_df.to_csv(output_filename, index=False)
    print(f"Relevant companies saved to {output_filename}")

    return filtered_df

relevant_companies = find_relevant_companies(matching_industries, company_size)
print(relevant_companies.head())

