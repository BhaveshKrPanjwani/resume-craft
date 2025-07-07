// utils/generateLatexFromStore.js
const escape = (text) =>
  text
    ?.replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\$/g, "\\$")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}");

const generateLatexFromStore = (data) => {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    extraCurriculars,
    languages,
    volunteer,
    publications,
  } = data;

  return `
\\documentclass[10pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\setlist[itemize]{noitemsep, topsep=0pt}
\\begin{document}

\\section*{Personal Information}
Name: ${escape(personalInfo.name)}\\\\
Email: ${escape(personalInfo.email)}\\\\
LinkedIn: ${escape(personalInfo.linkedin)}\\\\
GitHub: ${escape(personalInfo.github)}\\\\

\\section*{Education}
${education.map(e => `\\textbf{${escape(e.institution)}} -- ${escape(e.degree)} (${e.year})\\\\`).join('\n')}

\\section*{Work Experience}
${experience.map(exp => `
\\textbf{${escape(exp.title)}} @ ${escape(exp.company)} (${exp.startDate} -- ${exp.endDate})\\\\
\\begin{itemize}
  \\item ${escape(exp.description)}
\\end{itemize}
`).join('\n')}

\\section*{Skills}
${skills.map(s => escape(s.name)).join(', ')}

${projects?.length ? `
\\section*{Projects}
${projects.map(p => `
\\textbf{${escape(p.title)}}\\\\
\\begin{itemize}
  \\item ${escape(p.description)}
\\end{itemize}`).join('\n')}
` : ''}

${certifications?.length ? `
\\section*{Certifications}
${certifications.map(c => `\\textbf{${escape(c.name)}}, ${escape(c.issuer)}, ${c.date}\\\\`).join('\n')}
` : ''}

${achievements?.length ? `
\\section*{Achievements}
${achievements.map(a => `
\\begin{itemize}
  \\item ${escape(a.title)} (${a.date}): ${escape(a.description)}
\\end{itemize}`).join('\n')}
` : ''}

${extraCurriculars?.length ? `
\\section*{Extra-Curriculars}
${extraCurriculars.map(e => `
\\begin{itemize}
  \\item ${escape(e.title)} (${e.date}): ${escape(e.description)}
\\end{itemize}`).join('\n')}
` : ''}

${languages?.length ? `
\\section*{Languages}
${languages.map(l => `- ${escape(l.name)}: ${escape(l.proficiency)}\\\\`).join('\n')}
` : ''}

${volunteer?.length ? `
\\section*{Volunteer Work}
${volunteer.map(v => `
\\textbf{${escape(v.organization)}}\\\\
\\begin{itemize}
  \\item ${escape(v.description)}
\\end{itemize}`).join('\n')}
` : ''}

${publications?.length ? `
\\section*{Publications}
${publications.map(pub => `- ${escape(pub.title)}, ${escape(pub.journal)} (${pub.year})\\\\`).join('\n')}
` : ''}

\\end{document}
`;
};

export default generateLatexFromStore;
