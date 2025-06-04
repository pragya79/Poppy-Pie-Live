df = pd.read_csv('extracted1.csv')

if df.empty:
    print("The CSV file is empty. No data to process.")
else:
    essential_columns = ['first_name', 'occupation', 'city', 'country', 'accomplishment_projects', 'interests']
    df_filtered = df.dropna(subset=essential_columns, how='all')
    if df_filtered.empty:
        print("No valid data to process after filtering. Please check the CSV.")
    else:
        
        def generate_message(row):
            first_name = row.get('first_name', 'there')
            occupation = row.get('occupation', 'your field of expertise')
            city = row.get('city', 'your location')
            country = row.get('country', 'your country')
            accomplishments = row.get('accomplishment_projects', 'your impressive projects')
            interests = row.get('interests', 'your professional interests')

            message = f"Hi {first_name},\n\n"
            message += f"I hope you're doing well in {city}, {country}! "
            message += f"I noticed you're working as a {occupation}, which is really impressive. "
            message += f"The work you have done in your field is really inspiring!\n\n"
            message += f"I'm currently working on a project that I believe closely aligns with your background and expertise. I'd really appreciate hearing your thoughts or insights, and if you're open to it, I'd love to connect further. "
            message += "\n\n"
            message += "Best regards,\n[Your Name]"

            return message

        
        df_filtered['personalized_message'] = df_filtered.apply(generate_message, axis=1)

        df_filtered[['full_name', 'personalized_message']].to_csv('personalized_messages.csv', index=False)
        print(f"✅ Personalized messages saved to 'personalized_messages.csv'.")

