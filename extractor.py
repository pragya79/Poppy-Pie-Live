API_KEY = "# Replace with your actual Proxycurl API key"  # Replace with your actual Proxycurl API key
INPUT_CSV = "linkedin_profiles1.csv"     # Replace with your actual input CSV file path
OUTPUT_CSV = "extracted1.csv"
API_ENDPOINT = "https://nubela.co/proxycurl/api/v2/linkedin"

df = pd.read_csv(INPUT_CSV)

results = []

for idx, row in df.iterrows():
    profile_url = row['LinkedIn Profile']
    company = row['Company']
    
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    params = {
        "url": profile_url,
        "use_cache": "if-present"
    }

    print(f"🔍 Fetching data for: {profile_url}")
    response = requests.get(API_ENDPOINT, headers=headers, params=params)

    if response.status_code == 200:
        data = response.json()
        data['Input Company'] = company
        data['Profile URL'] = profile_url
        results.append(data)
    else:
        print(f"❌ Failed for {profile_url} | Status: {response.status_code}")
        results.append({
            'Input Company': company,
            'Profile URL': profile_url,
            'error': response.text
        })

    time.sleep(1.5)

output_df = pd.DataFrame(results)
output_df.to_csv(OUTPUT_CSV, index=False)
print(f"\n✅ All done! Data saved to '{OUTPUT_CSV}'")
