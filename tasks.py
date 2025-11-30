from crewai import Task
from .agents import (
    paper_analyst,
    market_mapper,
    business_designer,
    technical_architect,
    mvp_planner,
)


def create_tasks(paper_text: str):
    # 1) Understand the research paper
    t1 = Task(
        description=(
            "You are given the raw text of a research paper.\n\n"
            "1. Identify the likely title (if visible).\n"
            "2. Identify the domain/field (e.g., NLP, computer vision, healthcare, finance, etc.).\n"
            "3. Explain the core problem the paper is trying to solve.\n"
            "4. Summarize the main method/approach.\n"
            "5. List the key contributions in bullet points.\n"
            "6. Mention any assumptions or limitations if visible.\n\n"
            f"Research paper text:\n{paper_text[:8000]}"
        ),
        agent=paper_analyst,
        expected_output=(
            "A structured markdown summary with sections: Title, Domain, "
            "Problem, Method, Contributions, Limitations."
        ),
    )

    # 2) Map research to markets and problems
    t2 = Task(
        description=(
            "Using the analysis from the Paper Analyst, identify 3–5 real-world "
            "industries and concrete problems that this research could help solve. "
            "For each industry, provide:\n"
            "- Industry name\n"
            "- Specific problem / pain point\n"
            "- Who experiences this problem (user persona)\n"
            "- Why the research method is relevant here"
        ),
        agent=market_mapper,
        expected_output=(
            "A markdown list of 3–5 potential use-cases grouped by industry."
        ),
    )

    # 3) Turn use-cases into product ideas
    t3 = Task(
        description=(
            "Using the identified industries and problems, design 3 concrete "
            "product ideas. For each product, provide:\n"
            "- Product name\n"
            "- Target users\n"
            "- Core features\n"
            "- Value proposition (why it is useful)\n"
            "- How it is different from naive or existing approaches"
        ),
        agent=business_designer,
        expected_output="A markdown section listing 3 detailed product ideas.",
    )

    # 4) Design a system architecture for the best product
    t4 = Task(
        description=(
            "Choose the single most promising product idea from the previous step "
            "and design a realistic technical architecture for it.\n\n"
            "Include:\n"
            "- Overall high-level description\n"
            "- Main components/services (e.g., frontend, backend, databases, ML services)\n"
            "- Data flow between components\n"
            "- Suggested tech stack (frameworks, languages, databases, cloud services)\n"
            "- Any scalability or security considerations if relevant"
        ),
        agent=technical_architect,
        expected_output=(
            "A markdown section titled 'Technical Architecture' with bullet points "
            "and short paragraphs."
        ),
    )

    # 5) Combine everything into a final report + MVP plan
    t5 = Task(
        description=(
            "Using all previous analyses (paper summary, market mapping, product "
            "ideas, and architecture), create a final report with the following "
            "sections in markdown:\n\n"
            "## 1. Research Paper Summary\n"
            "Short, non-technical summary (5–8 lines).\n\n"
            "## 2. Market Opportunities & Use-Cases\n"
            "List the best industries and problems this research can solve.\n\n"
            "## 3. Selected Product Concept\n"
            "Describe the chosen product in more detail.\n\n"
            "## 4. Technical Architecture Overview\n"
            "Summarize the planned system architecture and stack.\n\n"
            "## 5. MVP Roadmap (4–6 weeks)\n"
            "Create 3–4 milestones to build an MVP version.\n\n"
            "## 6. Short Pitch (for LinkedIn / investors)\n"
            "Write a concise 6–10 line pitch explaining the idea and impact."
        ),
        agent=mvp_planner,
        expected_output="A single, well-structured markdown report with these sections.",
    )

    # Order matters: Crew will run tasks in sequence
    return [t1, t2, t3, t4, t5]
