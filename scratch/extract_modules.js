const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '../content/modules/31_modules_FSD');
const outputFile = path.join(__dirname, '../src/lib/curriculumData.js');

const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.md') && f !== '00_Course_Index_and_Roadmap.md');

// Sort files to ensure 01, 02, 03... order
files.sort((a, b) => a.localeCompare(b));

const modules = files.map((file, index) => {
    const filePath = path.join(modulesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract title
    const titleMatch = content.match(/^# Module \d+:\s*(.*)/m);
    const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '').replace(/^\d+_+/, '').replace(/_/g, ' ');
    
    // Extract description (usually the first paragraph under Overview)
    const overviewMatch = content.match(/## 1\. Overview\s*([^#]+)/);
    let description = '';
    if (overviewMatch) {
        description = overviewMatch[1].trim().split('\n\n')[0].replace(/\n/g, ' ').trim();
        if (description.length > 150) {
            description = description.substring(0, 147) + '...';
        }
    }

    const slug = file.replace('.md', '').toLowerCase();

    return {
        id: index + 1,
        number: String(index + 1).padStart(2, '0'),
        title: title,
        description: description,
        slug: slug,
        status: 'Not Started'
    };
});

const fileContent = `export const modules = ${JSON.stringify(modules, null, 2)};
`;

fs.writeFileSync(outputFile, fileContent, 'utf-8');
console.log('Successfully generated curriculum data at ' + outputFile);
