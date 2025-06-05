# Google Programmable Search API Credentials
API_KEY = "#Replace with your Google Programmable Search API" #Replace with your Google Programmable Search API 
CX = "#Replace with your Google Programmable Search CX"  #Replace with your Google Programmable Search CX

input_csv = "relevant_companies1.csv"
output_csv = "linkedin_profiles1.csv"

df = pd.read_csv(input_csv)
companies = df["name"].dropna().tolist()[:3]  # Limited to top 3

if os.path.exists(output_csv):
    df_existing = pd.read_csv(output_csv)
    searched_companies = set(df_existing["Company"].tolist())
else:
    df_existing = pd.DataFrame(columns=["Company", "LinkedIn Profile"])
    searched_companies = set()

results = []

def google_search(query, num_results=5):
    url = f"https://www.googleapis.com/customsearch/v1?q={query}&key={API_KEY}&cx={CX}"
    try:
        response = requests.get(url)
        data = response.json()
        links = []
        for item in data.get("items", []):
            links.append(item["link"])
            if len(links) >= num_results:
                break
        return links
    except Exception as e:
        print(f"Error fetching results: {e}")
        return []

for company in companies:
    if company in searched_companies:
        print(f"Skipping {company}, already searched.")
        continue

    print(f"Searching LinkedIn profiles for {company}...")
    try:
        query = f'site:linkedin.com/in "{company}" "works at {company}"'
        linkedin_profiles = google_search(query, num_results=5)

        for profile in linkedin_profiles:
            results.append({"Company": company, "LinkedIn Profile": profile})

        if results:
            df_temp = pd.DataFrame(results)
            df_temp.to_csv(output_csv, mode='a', header=not os.path.exists(output_csv), index=False)
            results = []

    except Exception as e:
        print(f"Error searching for {company}: {e}")
        time.sleep(60)

    time.sleep(10)

print(f"LinkedIn profiles saved in {output_csv}")
