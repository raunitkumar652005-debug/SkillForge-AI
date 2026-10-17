import { promises as fs } from 'fs';
import path from 'path';
import { modules } from './curriculumData';

/**
 * Extracts a specific section from the markdown content.
 * It looks for `## <Number>. <SectionName>` and captures everything until the next `##` or end of string.
 */
function extractSection(content, sectionNameRegex) {
  // Regex to match "## 1. Overview", "## 13. Interview Questions", etc.
  // Then captures lazily until the next "## " or end of file
  const regex = new RegExp(`^##\\s+\\d+\\.\\s+${sectionNameRegex}\\s*\\n([\\s\\S]*?)(?=^## |$)`, 'im');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

export async function getRevisionData(slug) {
  const modMeta = modules.find(m => m.slug === slug);
  if (!modMeta) return null;

  const modulesDir = path.join(process.cwd(), 'content/modules/31_modules_FSD');
  try {
    const files = await fs.readdir(modulesDir);
    const targetFile = files.find(f => f.replace('.md', '').toLowerCase() === slug);
    if (!targetFile) return null;

    const filePath = path.join(modulesDir, targetFile);
    const content = await fs.readFile(filePath, 'utf-8');

    return {
      slug: modMeta.slug,
      moduleNumber: modMeta.number,
      title: modMeta.title,
      description: modMeta.description,
      overview: extractSection(content, 'Overview'),
      summary: extractSection(content, 'Summary'),
      keywords: extractSection(content, 'Keywords'),
      tags: extractSection(content, 'Tags'),
      interviewQuestions: extractSection(content, 'Interview Questions'),
      practiceQuestions: extractSection(content, 'Practice Questions'),
      codingExercises: extractSection(content, 'Coding Exercises'),
      relatedTopics: extractSection(content, 'Related Topics'),
      suggestedNextTopics: extractSection(content, 'Suggested Next Topics')
    };
  } catch (error) {
    console.error(`Error reading module ${slug}:`, error);
    return null;
  }
}

export async function getAllRevisionData() {
  const allData = [];
  for (const mod of modules) {
    const data = await getRevisionData(mod.slug);
    if (data) {
      // Calculate how many revision sections are present
      const revisionSections = [
        data.summary,
        data.keywords,
        data.interviewQuestions,
        data.practiceQuestions,
        data.codingExercises
      ];
      data.sectionsCount = revisionSections.filter(Boolean).length;
      allData.push(data);
    }
  }
  return allData;
}
