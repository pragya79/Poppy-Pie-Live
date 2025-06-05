df = pd.read_csv("F:/ai-leadgen/data/companies_sorted.csv")
industries = df["industry"].dropna().unique().tolist()
print(industries)

model = SentenceTransformer('all-MiniLM-L6-v2')

industry_embeddings = model.encode(industries, convert_to_tensor=True)
size_categories = ["small startup", "early-stage", "seed-funded", "large company", "corporation", "enterprise"]

size_embeddings = model.encode(size_categories, convert_to_tensor=True)
def find_best_matching_industry(user_input, top_n=2):
    """Finds the top N best matching industries for a given user input."""
    user_embedding = model.encode(user_input, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(user_embedding, industry_embeddings).squeeze(0)
    top_indices = similarities.argsort(descending=True)[:top_n]
    best_matches = [industries[i] for i in top_indices] 

    return best_matches


def find_company_size_sbert(user_input, threshold=0.3):
    """Identifies the company size (small startup or large enterprise) based on user input."""
    user_embedding = model.encode(user_input, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(user_embedding, size_embeddings).squeeze(0)

    best_match_index = similarities.argmax().item()
    best_match_score = similarities[best_match_index].item()

    if best_match_score < threshold:
        return "Not specified"

    return "51-200" if best_match_index < 3 else "10001+"
