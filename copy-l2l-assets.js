const fs = require('fs');
const path = require('path');

const files = [
  {
    src: 'C:\\Users\\newbr\\Documents\\Learners To Leaders\\Proposal\\Venue\\Gemini_Generated_Image_p5v1wp5v1wp5v1wp.png',
    dest: 'community-classroom.png',
  },
  {
    src: 'C:\\Users\\newbr\\Documents\\Learners To Leaders\\Proposal\\Venue\\Gemini_Generated_Image_p5v1wp5v1wp5v1wp.jpg',
    dest: 'community-classroom.jpg',
  },
];

const destDir = path.join(__dirname, 'public', 'assets', 'images', 'l2l');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

for (const { src, dest } of files) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(destDir, dest));
    console.log(`✓ Copied ${dest}`);
  } else {
    console.log(`⚠ Not found: ${src}`);
  }
}
