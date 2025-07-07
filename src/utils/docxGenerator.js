import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType,
  SectionType,
  Table,
  TableRow,
  TableCell,
  WidthType
} from 'docx';

export const generateDocument = (resumeData) => {
  const { personalInfo, experience, education, skills } = resumeData;

  // Create document sections
  const sections = [];

  // Header section
  const header = new Paragraph({
    children: [
      new TextRun({
        text: personalInfo.name,
        bold: true,
        size: 28,
      }),
      new TextRun({
        text: "\n" + personalInfo.title,
        size: 22,
        color: "555555",
      }),
      new TextRun({
        text: "\n" + [personalInfo.email, personalInfo.phone].filter(Boolean).join(" | "),
        size: 20,
      }),
    ],
    spacing: { after: 400 },
  });

  // Summary section
  const summary = personalInfo.summary ? new Paragraph({
    children: [
      new TextRun({
        text: "Professional Summary",
        bold: true,
        size: 22,
        underline: true,
      }),
      new TextRun({
        text: "\n" + personalInfo.summary,
        size: 20,
      }),
    ],
    spacing: { after: 400 },
  }) : null;

  // Experience section
  const experienceSection = experience.length > 0 ? [
    new Paragraph({
      text: "Professional Experience",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    }),
    ...experience.flatMap((exp, index) => [
      new Paragraph({
        children: [
          new TextRun({
            text: exp.position,
            bold: true,
            size: 20,
          }),
          new TextRun({
            text: `\t${exp.company}`,
            bold: true,
            size: 20,
          }),
          new TextRun({
            text: `\n${exp.startDate} - ${exp.endDate}`,
            italics: true,
            size: 18,
          }),
        ],
      }),
      ...exp.description.split('\n').map(bullet => 
        new Paragraph({
          children: [
            new TextRun({
              text: "• " + bullet,
              size: 18,
            }),
          ],
          indent: { left: 400 },
        })
      ),
      index < experience.length - 1 ? 
        new Paragraph({ text: "", spacing: { after: 200 } }) : 
        new Paragraph({ text: "", spacing: { after: 400 } })
    ])
  ] : [];

  // Education section
  const educationSection = education.length > 0 ? [
    new Paragraph({
      text: "Education",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    }),
    ...education.map(edu => new Paragraph({
      children: [
        new TextRun({
          text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
          bold: true,
          size: 20,
        }),
        new TextRun({
          text: `\n${edu.institution}`,
          size: 18,
        }),
        new TextRun({
          text: `\n${edu.startDate} - ${edu.endDate}`,
          italics: true,
          size: 18,
        }),
      ],
      spacing: { after: 200 },
    }))
  ] : [];

  // Skills section
  const skillsSection = skills.length > 0 ? [
    new Paragraph({
      text: "Skills",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: skills.map(skill => skill.name).join(', '),
          size: 18,
        }),
      ],
    })
  ] : [];

  // Combine all sections
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1000,
            right: 1000,
            bottom: 1000,
            left: 1000,
          },
        },
      },
      children: [
        header,
        ...(summary ? [summary] : []),
        ...experienceSection,
        ...educationSection,
        ...skillsSection,
      ],
    }],
  });

  return doc;
};