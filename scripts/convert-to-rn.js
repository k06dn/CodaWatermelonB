#!/usr/bin/env node

/**
 * Automated conversion script for React Web to React Native
 * This handles the most common conversion patterns
 */

const fs = require('fs');
const path = require('path');

const conversions = [
  // Remove "use client" directives
  { from: /^"use client";\s*\n/gm, to: '' },
  { from: /^'use client';\s*\n/gm, to: '' },

  // Replace Framer Motion imports
  { from: /from ['"]motion\/react['"]/g, to: 'from "react-native-reanimated"' },
  { from: /import \{([^}]+)\} from ['"]motion\/react['"]/g, to: '// Removed Framer Motion - replace with Reanimated' },

  // Replace lucide-react with lucide-react-native
  { from: /from ['"]lucide-react['"]/g, to: 'from "lucide-react-native"' },

  // Replace sonner toast
  { from: /from ['"]sonner@2\.0\.3['"]/g, to: 'from "react-native-toast-message"' },
  { from: /from ['"]sonner['"]/g, to: 'from "react-native-toast-message"' },
  { from: /import \{ Toaster \} from ['"]\.\/ui\/sonner['"]/g, to: 'import Toast from "react-native-toast-message"' },

  // Replace localStorage
  { from: /localStorage\.getItem/g, to: 'await storage.getItem' },
  { from: /localStorage\.setItem/g, to: 'await storage.setItem' },
  { from: /localStorage\.removeItem/g, to: 'await storage.removeItem' },
  { from: /localStorage\.clear/g, to: 'await storage.clear' },

  // Replace window/document APIs
  { from: /document\.documentElement/g, to: '// document.documentElement - removed for RN' },
  { from: /window\./g, to: '// window - removed for RN //' },

  // Replace basic HTML elements with React Native components
  { from: /<div /g, to: '<View ' },
  { from: /<\/div>/g, to: '</View>' },
  { from: /<button /g, to: '<TouchableOpacity ' },
  { from: /<\/button>/g, to: '</TouchableOpacity>' },
  { from: /<p /g, to: '<Text ' },
  { from: /<\/p>/g, to: '</Text>' },
  { from: /<span /g, to: '<Text ' },
  { from: /<\/span>/g, to: '</Text>' },
  { from: /<h1 /g, to: '<Text ' },
  { from: /<\/h1>/g, to: '</Text>' },
  { from: /<h2 /g, to: '<Text ' },
  { from: /<\/h2>/g, to: '</Text>' },
  { from: /<h3 /g, to: '<Text ' },
  { from: /<\/h3>/g, to: '</Text>' },
  { from: /<h4 /g, to: '<Text ' },
  { from: /<\/h4>/g, to: '</Text>' },
  { from: /<input /g, to: '<TextInput ' },
  { from: /<\/input>/g, to: '</TextInput>' },

  // Replace event handlers
  { from: /onClick=/g, to: 'onPress=' },

  // Replace className with className (NativeWind still uses className)
  // but we need to ensure it's compatible

  // Replace motion components
  { from: /motion\.div/g, to: 'Animated.View' },
  { from: /motion\.button/g, to: 'Animated.View' }, // Will need manual conversion to TouchableOpacity
  { from: /motion\.p/g, to: 'Animated.View' }, // Will need manual conversion to Text
  { from: /motion\.span/g, to: 'Animated.View' },
  { from: /<AnimatePresence>/g, to: '{/* AnimatePresence - replace with conditional render */' },
  { from: /<\/AnimatePresence>/g, to: '' },

  // Add React Native imports if not present
  // This is handled separately
];

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Apply all conversions
  conversions.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  // Add imports if we made changes
  if (content !== original) {
    // Check if file needs React Native imports
    if (content.includes('<View') || content.includes('<Text') || content.includes('<TouchableOpacity')) {
      const imports = new Set();

      if (content.includes('<View') || content.includes('View ')) imports.add('View');
      if (content.includes('<Text') || content.includes('Text ')) imports.add('Text');
      if (content.includes('<TouchableOpacity')) imports.add('TouchableOpacity');
      if (content.includes('<TextInput')) imports.add('TextInput');
      if (content.includes('<ScrollView')) imports.add('ScrollView');
      if (content.includes('<Image') && !content.includes('ImageWithFallback')) imports.add('Image');

      if (imports.size > 0) {
        const importStatement = `import { ${Array.from(imports).join(', ')} } from 'react-native';\n`;

        // Find the first import statement and add after it
        const firstImportIndex = content.indexOf('import');
        if (firstImportIndex !== -1 && !content.includes("from 'react-native'")) {
          content = content.slice(0, firstImportIndex) + importStatement + content.slice(firstImportIndex);
        }
      }
    }

    // Write the file back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Converted: ${filePath}`);
    return true;
  }

  return false;
}

function convertDirectory(dirPath, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  let convertedCount = 0;

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      convertedCount += convertDirectory(filePath, extensions);
    } else if (stat.isFile() && extensions.some(ext => file.endsWith(ext))) {
      if (convertFile(filePath)) {
        convertedCount++;
      }
    }
  });

  return convertedCount;
}

// Run conversion
const targetDir = process.argv[2] || path.join(__dirname, '..', 'components');
console.log(`Converting files in: ${targetDir}`);
const count = convertDirectory(targetDir);
console.log(`\n✓ Converted ${count} files`);
console.log('\nNote: Manual review required for:');
console.log('- Framer Motion animations (convert to Reanimated)');
console.log('- localStorage calls (must be async)');
console.log('- Complex motion components');
console.log('- UI library components (Radix, etc.)');
