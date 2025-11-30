# Automated Research Paper → Business Use-Case Generator 

A **multi-agent AI system** built using **CrewAI** that converts research papers into:
- Clear technical summaries  
- Real-world market opportunities  
- Viable product ideas  
- Scalable technical architecture  
- 4–6 week MVP roadmap + professional pitch  

Designed for professionals and students who want to **bridge the gap between research and real business impact**.

---

## 🧠 Agent Crew
| Agent | Responsibility |
|------|---------------|
| Paper Analyst | Extracts problem, method, contributions, limitations |
| Market Mapper | Maps research into real-world industry problems |
| Business Designer | Creates profitable product concepts & GTM strategy |
| Technical Architect | Generates dev-ready system design & tech stack |
| MVP Planner | Builds 4–6 week roadmap + resume-worthy pitch |

---

## 🛠 Tech Stack
- **LLM Orchestration:** CrewAI  
- **Model Provider:** OpenAI (gpt-4o-mini)  
- **Frontend/UI:** Streamlit, React, TypeScript  
- **PDF Parsing:** PyPDF  
- **Environment:** Python + Virtualenv + dotenv  
- **Outputs:** Markdown reports, architecture plans, MVP milestones  

---

## 📁 Project Structure

research_usecase_generator/
├── app.py
├── server.py
├── crew/
│ ├── init.py
│ ├── agents.py
│ ├── tasks.py
│ ├── crew.py
│ └── config.py
├── services/
│ └── paper_loader.py
├── examples/
│ └── sample_output.md
├── .env
└── requirements.txt
