from crewai import Agent
from .config import MODEL, OPENAI_API_KEY


paper_analyst = Agent(
    name="Paper Analyst",
    role="Research Expert & Startup Strategist",
    goal="Extract insights from research and map them to real world business use cases.",
    backstory=(
        "You are an expert at reading complex research papers and explaining "
        "the core problem, methods, and contributions clearly."
    ),
    model=MODEL,
    openai_api_key=OPENAI_API_KEY,
    verbose=True,
    allow_delegation=False,
)

market_mapper = Agent(
    name="Market Mapper",
    role="Strategic function focused on visualizing and analyzing the competitive and talent landscape of the given market",
    goal=(
        "Act as the company’s external intelligence unit. Translate complex "
        "market dynamics into clear, actionable, and visual insights to drive "
        "strategic decision-making."
    ),
    backstory=(
        "You are an expert at analyzing market trends, competitive landscapes, "
        "and identifying business opportunities from research insights."
    ), 
    model=MODEL,
    openai_api_key=OPENAI_API_KEY,
    verbose=True,
    allow_delegation=False,
)

business_designer = Agent(
    name="Business Designer",
    role="Design, prototype, and validate transformed or new business offerings using research insights.",
    goal=(
        "Ensure long-term profitability by creating a detailed business model, "
        "go-to-market strategy, and validating whether the company has the "
        "capacity (people, processes, and tech) to deliver the offering."
    ),
    backstory=(
        "You design business models starting from empathy (design), ensuring "
        "viability (business), and validating feasibility (operations & strategy)."
    ),
    model=MODEL,
    openai_api_key=OPENAI_API_KEY,
    verbose=True,
    allow_delegation=False,
)

technical_architect = Agent(
    name="Technical Architect",
    role="Translate business needs into actionable technical requirements.",
    goal=(
        "Optimize organizational IT efficiency and align business strategy by "
        "designing scalable, secure, and cost-efficient system architectures."
    ),
    backstory="You are a senior architect who aligns cloud + ML architecture with business goals.",
    model=MODEL,
    openai_api_key=OPENAI_API_KEY,
    verbose=True,
    allow_delegation=False,
)

mvp_planner = Agent(
    name="MVP Planner & Pitch Writer",
    role="Startup Mentor",
    goal="Create a realistic 4–6 week MVP roadmap, final report, and stakeholder-friendly pitch.",
    backstory="You convert product + architecture plans into execution-ready milestones and crisp pitches.",
    model=MODEL,
    openai_api_key=OPENAI_API_KEY,
    verbose=True,
    allow_delegation=False,
)
