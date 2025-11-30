from crewai import Crew
from .tasks import create_tasks
from .agents import (
    paper_analyst,
    market_mapper,
    business_designer,
    technical_architect,
    mvp_planner,
)


def run_pipeline(paper_text: str) -> str:
    tasks = create_tasks(paper_text)

    crew = Crew(
        agents=[
            paper_analyst,
            market_mapper,
            business_designer,
            technical_architect,
            mvp_planner,
        ],
        tasks=tasks,
        verbose=True,
    )

    result = crew.kickoff()
    return str(result)

