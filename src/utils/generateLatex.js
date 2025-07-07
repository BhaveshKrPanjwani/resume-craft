const generateLatex = (resume) => {
  const { personalInfo, experience, education, skills, achievements = [], extraCurriculars = [] } = resume;

  return `
\\documentclass{article}
\\usepackage{enumitem}
\\usepackage[margin=1in]{geometry}
\\begin{document}

% Personal Info
\\textbf{Name:} ${personalInfo.name || "Name"} \\\\
\\textbf{Email:} ${personalInfo.email || "Email"} \\\\
\\textbf{GitHub:} ${personalInfo.github || ""} \\\\

\\section*{Experience}
${experience.map(e => `\\textbf{${e.role}} at ${e.company} (${e.startDate} - ${e.endDate}) \\\\ ${e.description} \\\\`).join('\n')}

\\section*{Education}
${education.map(e => `${e.degree} - ${e.institution} (${e.year}) \\\\`).join('\n')}

\\section*{Skills}
\\begin{itemize}[leftmargin=*]
${skills.map(s => `\\item ${s.name}`).join('\n')}
\\end{itemize}

\\section*{Achievements}
\\begin{itemize}[leftmargin=*]
${achievements.map(a => `\\item ${a.title} (${a.date}) - ${a.description}`).join('\n')}
\\end{itemize}

\\section*{Extra-Curricular Activities}
\\begin{itemize}[leftmargin=*]
${extraCurriculars.map(x => `\\item ${x.title} (${x.date}) - ${x.description}`).join('\n')}
\\end{itemize}

\\end{document}
`;
};

export default generateLatex;
