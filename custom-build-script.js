const fs = require('fs');
const path = require('path');


// 빌드가 될 js 파일의 경로
const jsBuildPath = path.resolve(__dirname, 'build', 'static', 'js');

// 변경할 js 파일명
const jsNewFileName = 'bot.js';

// 변경된 js 파일명
const jsIndexPath = fs.readdirSync(jsBuildPath).find((file) =>
    /^main\.[a-f0-9]{8}\.js$/.test(file)
);
const jsRandomNumber = jsIndexPath.match(/[a-f0-9]{8}/)[0];

// 변경할 js 파일의 경로
const jsNewFilePath = path.join(jsBuildPath, `main.${jsRandomNumber}.js`);
const jsNewFileNameWithPath = path.join(jsBuildPath, jsNewFileName);


/////////////////////////////////////////////////////////////////////////////////////////////////


// 빌드가 될 css 파일의 경로
const cssBuildPath = path.resolve(__dirname, 'build', 'static', 'css');

// 변경할 css 파일명
const cssNewFileName = 'bot.css';

// 변경된 css 파일 명
const cssIndexPath = fs.readdirSync(cssBuildPath).find((file) =>
    /^main\.[a-f0-9]{8}\.css$/.test(file)
);
const cssRandomNumber = cssIndexPath.match(/[a-f0-9]{8}/)[0];

// 변경할 css 파일의 경로
const cssNewFilePath = path.join(cssBuildPath, `main.${cssRandomNumber}.css`);
const cssNewFileNameWithPath = path.join(cssBuildPath, cssNewFileName);


//////////////////////////////////////////////////////////////////////////////////////////////


try {
    fs.renameSync(jsNewFilePath, jsNewFileNameWithPath);
    fs.renameSync(cssNewFilePath, cssNewFileNameWithPath);
    console.log('빌드 파일명 변경이 완료되었습니다.');

    // js.LICENSE.txt 파일 삭제
    const jsLicensePath = path.join(jsBuildPath, `main.${jsRandomNumber}.js.LICENSE.txt`);
    if (fs.existsSync(jsLicensePath)) {
        fs.unlinkSync(jsLicensePath);
    }

    // js.map 파일 삭제
    const jsMapPath = path.join(jsBuildPath, `main.${jsRandomNumber}.js.map`);
    if (fs.existsSync(jsMapPath)) {
        fs.unlinkSync(jsMapPath);
    }

    // css.map 파일 삭제
    const cssMapPath = path.join(cssBuildPath, `main.${cssRandomNumber}.css.map`);
    if (fs.existsSync(cssMapPath)) {
        fs.unlinkSync(cssMapPath);
    }
} catch (error) {
    console.error('빌드 파일명 변경 중 오류가 발생했습니다.', error);
}