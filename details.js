const SUPABASE_URL = "https://zqywmmcrfgqpuzecuvnz.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxeXdtbWNyZmdxcHV6ZWN1dm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MjM4NTksImV4cCI6MjEwNjM5OTg1OX0.dAmK-JwS_o5onpv5KcLy2XtmW0V_DUizh92NKYwvgLg";
 
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct() {
    const detail = document.getElementById("detail");

    if (!detail) {
        console.error("Element with id='detail' was not found");
        return;
    }

    if (!productId) {
        detail.innerHTML = "<p>Product ID is missing from URL.</p>";
        return;
    }

    const { data, error } = await supabaseClient
        .from("product")
        .select("*")
        .eq("product_id", productId)
        .maybeSingle();

    if (error) {
        console.error("Supabase error:", error);
        detail.innerHTML = "<p>Error loading product details.</p>";
        return;
    }

    if (!data) {
        detail.innerHTML = "<p>Product not found.</p>";
        return;
    }

    detail.innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.description ?? ""}</p>
        <p>Price: AED ${data.price}</p>
        <p>Stock: ${data.stock}</p>
    `;
}

loadProduct();
