import streamlit as st
from crew.crew import run_pipeline
from services.paper_loader import load_pdf_text

st.set_page_config(
    page_title="Research → Business Use-Case Generator",
    page_icon="📄",
    layout="wide",
)


def main():
    st.title("📄 → 💼 Research Paper to Business Use-Case Generator (CrewAI)")

    st.markdown(
        """
        Upload a research paper PDF and a team of AI agents will:

        1. Summarize the paper  
        2. Find market opportunities & use-cases  
        3. Propose product ideas  
        4. Design a technical architecture  
        5. Create an MVP roadmap and pitch  
        """
    )

    uploaded_file = st.file_uploader(
        "Upload Research Paper (PDF)", type=["pdf"], label_visibility="visible"
    )

    if "last_result" not in st.session_state:
        st.session_state["last_result"] = None

    col1, col2 = st.columns([1, 1])

    with col1:
        industry_hint = st.text_input(
            "Optional: Industry focus (e.g. healthcare, fintech, edtech)",
            help="This is just a hint for the agents. You can leave it blank.",
        )

    with col2:
        run_button = st.button("🚀 Generate Analysis & Use-Cases", type="primary")

    if uploaded_file and run_button:
        with st.spinner("Extracting text and running AI Crew… this may take a bit."):
            pdf_bytes = uploaded_file.read()
            paper_text = load_pdf_text(pdf_bytes)

            result = run_pipeline(paper_text)
            st.session_state["last_result"] = result

    if st.session_state["last_result"]:
        result = str(st.session_state["last_result"])  


        st.success("✅ Analysis complete!")

        
        st.download_button(
            label="⬇️ Download Full Report as Markdown",
            data=result,
            file_name="research_to_business_report.md",
            mime="text/markdown",
        )

        st.markdown("---")
        st.subheader("📌 Full AI-Generated Report")
        st.markdown(result)


if __name__ == "__main__":
    main()
