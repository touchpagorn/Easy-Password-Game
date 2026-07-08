/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Level, Difficulty } from './types';

// Lists of randomized components to prevent players from memorizing answers
const randomWords = [
  "coffee", "pencil", "guitar", "rocket", "forest", "castle", "planet", "winter",
  "wizard", "cookie", "bottle", "camera", "bridge", "island", "window", "garden",
  "hammer", "jacket", "canvas", "pocket", "magnet", "anchor", "violin", "shield",
  "helmet", "dragon", "jungle", "safari", "desert", "galaxy", "meteor", "tunnel",
  "saddle", "beacon", "candle", "feather", "journal", "lantern", "compass", "temple",
  "canyon", "velvet", "ribbon", "shadow", "silver", "bronze", "marble", "copper"
];

const animalWords = [
  "tiger", "panda", "koala", "eagle", "zebra", "lemur", "otter", "falcon",
  "dolphin", "rabbit", "monkey", "turtle", "lizard", "parrot", "badger", "jaguar"
];

const brandWords = [
  "Toyota", "Honda", "BMW", "Ford", "Sony", "Apple", "Google", "Nike", "Adidas",
  "Canon", "Nikon", "Dell", "Intel", "Asus", "Tesla", "Volvo", "Nissan"
];

const commonNames = [
  "John", "Mary", "David", "James", "Sarah", "Emily", "Michael", "Robert", "Linda",
  "William", "Elizabeth", "Richard", "Thomas", "Jessica", "Daniel", "Karen"
];

const keyboardWalks = [
  "qwertyuiop", "asdfghjkl", "zxcvbnm", "qazwsxedc", "123qweasd", "poiuytrewq"
];

const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*", "_", "?", "+", "="];

// Helper functions for randomized password generation
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(length: number): string {
  let res = "";
  for (let i = 0; i < length; i++) {
    res += Math.floor(Math.random() * 10).toString();
  }
  return res;
}

function randomYear(): string {
  return (2025 + Math.floor(Math.random() * 5)).toString(); // 2025 - 2029
}

function generateHighEntropy(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+?=";
  let res = "";
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

/**
 * Durstenfeld shuffle utility to randomize options
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Dynamically generates a custom 5-stage level set with fully randomized password values
 * for every single game session. This makes memorizing absolute strings or answers impossible,
 * forcing the player to actually evaluate the strength criteria to win.
 */
export function generateRandomGame(difficulty: Difficulty = 'medium'): Level[] {
  const levelsList: Level[] = [];

  // LEVEL 1: Character Variety (Time Limit: 10 seconds)
  const l1Variation = Math.random() < 0.5 ? 1 : 2;
  if (l1Variation === 1) {
    const correctVal = `P@ss_${randomElement(randomWords)}99!`;
    const numVal = randomDigits(8);
    const wordVal = `${randomElement(randomWords)}${randomDigits(3)}`;
    const phraseVal = `lovemy${randomElement(animalWords)}`;

    levelsList.push({
      id: 1,
      timeLimit: 10,
      focusTopic: "ประเภทตัวอักษรที่หลากหลาย (Character Variety)",
      questionText: "รหัสผ่านใดต่อไปนี้ที่ 'แข็งแกร่งที่สุด' ในการรับมือกับการเดาสุ่มแบบพื้นฐาน?",
      options: [
        {
          id: "1-a1",
          text: numVal,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวเลขเรียงลำดับ "${numVal}" สามารถถูกเดาได้ในระดับมิลลิวินาทีด้วยคอมพิวเตอร์ทั่วไป`
        },
        {
          id: "1-a2",
          text: wordVal,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! คำเดี่ยวภาษาอังกฤษบวกตัวเลขต่อท้าย "${wordVal}" เป็นเป้าหมายแรกๆ ของพจนานุกรมเดารหัสผ่าน`
        },
        {
          id: "1-a3",
          text: phraseVal,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! วลีสั้นๆ ทั่วไปแบบ "${phraseVal}" ถูกรวบรวมไว้ในฐานข้อมูลแฮกเกอร์เรียบร้อยแล้ว`
        },
        {
          id: "1-a4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุดในกลุ่มนี้! ตัวเลือก "${correctVal}" มีการผสมผสานครบทั้งอักษรพิมพ์ใหญ่, พิมพ์เล็ก, สัญลักษณ์ (@, !), ตัวเลข และอักษรปกติ`
        }
      ],
      learningTip: "การใช้อักขระที่หลากหลาย (ตัวพิมพ์ใหญ่, เล็ก, ตัวเลข, สัญลักษณ์) ช่วยเพิ่มความซับซ้อนให้รหัสผ่านอย่างทวีคูณ ทำให้โปรแกรมถอดรหัสผ่านทำงานช้าลงอย่างมาก!"
    });
  } else {
    const keyWalk = randomElement(keyboardWalks);
    const repeated = randomElement(["1", "a", "A", "9", "0"]).repeat(8);
    const welcomeYear = `welcome${randomYear()}`;
    const correctVal = generateHighEntropy(8);

    levelsList.push({
      id: 1,
      timeLimit: 10,
      focusTopic: "การเลี่ยงปุ่มเรียงพยัญชนะ (Standard Key Walks)",
      questionText: "รหัสผ่านไหน ปลอดภัยสุด",
      options: [
        {
          id: "1-b1",
          text: keyWalk,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การลากนิ้วบนคีย์บอร์ดแถวตรงอย่าง "${keyWalk}" เป็นสิ่งแรกๆ ที่โปรแกรมสแกนอัตโนมัติจะสุ่มป้อน`
        },
        {
          id: "1-b2",
          text: repeated,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวอักษรตัวเดิมซ้ำกันเป็นชุด "${repeated}" ไร้ความยากในการคำนวณถอดรหัสอย่างสิ้นเชิง`
        },
        {
          id: "1-b3",
          text: welcomeYear,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! คำทักทายทั่วไปคู่กับปีคริสต์ศักราชใกล้ตัว "${welcomeYear}" สามารถเดาได้ง่ายจากพจนานุกรมคำยอดฮิต`
        },
        {
          id: "1-b4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุดในกลุ่มนี้! ตัวเลือก "${correctVal}" สุ่มสลับตัวอักษรพิมพ์ใหญ่เล็ก อักษรพิเศษ และตัวเลขอย่างไร้ทิศทางและไม่มีรูปแบบบนคีย์บอร์ด`
        }
      ],
      learningTip: "หลีกเลี่ยงการใช้อักษรที่เรียงกันบนคีย์บอร์ด ไม่ว่าจะในแนวตั้ง แนวนอน หรือแนวทแยง เช่น qwerty, asdfgh, zxcvbn เพราะเครื่องมือแฮกรหัสจะสแกนหาลวดลายเหล่านี้ก่อนเสมอ"
    });
  }

  // LEVEL 2: Length vs Complexity (Time Limit: 8 seconds)
  const l2Variation = Math.random() < 0.5 ? 1 : 2;
  if (l2Variation === 1) {
    const shortSecure = `${randomElement(["Secure", "Safe", "Pass", "Key"])}${randomDigits(1)}`;
    const shortComplex = `${randomElement(["A", "B", "C"])}a${randomDigits(1)}!${randomElement(["B", "C", "D"])}b${randomDigits(1)}!`;
    const w1 = randomElement(randomWords);
    let w2 = randomElement(randomWords);
    while (w2 === w1) w2 = randomElement(randomWords);
    let w3 = randomElement(randomWords);
    while (w3 === w1 || w3 === w2) w3 = randomElement(randomWords);
    let w4 = randomElement(randomWords);
    while (w4 === w1 || w4 === w2 || w4 === w3) w4 = randomElement(randomWords);
    const passphraseVal = `${w1}-${w2}-${w3}-${w4}`;
    const adminYear = `admin${randomYear()}`;

    levelsList.push({
      id: 2,
      timeLimit: 8,
      focusTopic: "ความยาวรหัสผ่าน (Password Length vs Complexity)",
      questionText: "ระหว่างรหัสผ่านที่พยายามทำให้ซับซ้อนแต่สั้น กับรหัสผ่านที่เป็นประโยคยาว รหัสไหนปลอดภัยกว่ากัน?",
      options: [
        {
          id: "2-a1",
          text: shortSecure,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ตัวเลือก "${shortSecure}" มีความยาวน้อยเกินไป (น้อยกว่า 8 อักษร) ส่งผลให้ทนแรงค้นหาแบบ Brute force ได้สั้นมาก`
        },
        {
          id: "2-a2",
          text: shortComplex,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! ตัวเลือก "${shortComplex}" แม้จะมีครบทุกประเภทตัวละคร แต่มีความยาวค่อนข้างสั้น และมีโครงสร้างวนซ้ำเป็นสัญลักษณ์เดาง่าย`
        },
        {
          id: "2-a3",
          text: passphraseVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${passphraseVal}" ใช้รูปแบบประโยควลีสุ่ม (Passphrase) ยาวมากถึง ${passphraseVal.length} ตัวอักษร ซึ่งเป็นระดับความยาวที่คอมพิวเตอร์ต้องใช้เวลานับล้านปีในการสแกนแบบสุ่มครอบจักรวาล`
        },
        {
          id: "2-a4",
          text: adminYear,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวเลือก "${adminYear}" เป็นคำศัพท์เชิงระบบที่เป็นเป้าหมายเริ่มต้นยอดนิยมของการโจมตี`
        }
      ],
      learningTip: "ความยาวคือราชา! รหัสผ่านที่ยาวและจำง่าย (Passphrase) เช่น คำสุ่ม 4 คำต่อกัน ปลอดภัยจากการโจมตีแบบ Brute Force มากกว่ารหัสผ่านสั้นๆ ที่ใส่สัญลักษณ์พิเศษเสียอีก"
    });
  } else {
    const grammarPhrase = `mynameis${randomElement(commonNames).toLowerCase()}`;
    const lovePhrase = `ilove${randomElement(animalWords)}sanddogs`;
    const w1 = randomElement(randomWords);
    let w2 = randomElement(randomWords);
    while (w2 === w1) w2 = randomElement(randomWords);
    let w3 = randomElement(randomWords);
    while (w3 === w1 || w3 === w2) w3 = randomElement(randomWords);
    const customPassphrase = `${w1}_${w2}_${w3}_${randomDigits(2)}`;
    const characterName = `${randomElement(["superman", "batman", "spiderman", "ironman"])}${randomDigits(5)}`;

    levelsList.push({
      id: 2,
      timeLimit: 8,
      focusTopic: "โครงสร้าง Passphrase ที่ยอดเยี่ยม",
      questionText: "รหัสผ่านไหน ปลอดภัยสุด",
      options: [
        {
          id: "2-b1",
          text: grammarPhrase,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ประโยคภาษาอังกฤษที่มีโครงสร้างไวยากรณ์สากล "${grammarPhrase}" ถูกจัดหาและทดสอบในพจนานุกรมประโยคยอดนิยมได้รวดเร็ว`
        },
        {
          id: "2-b2",
          text: lovePhrase,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ประโยคแสดงความชอบแบบ "${lovePhrase}" เป็นรูปแบบจิตวิทยาที่แฮกเกอร์มีเครื่องมือในการทำพจนานุกรมสุ่มเจาะจงเฉพาะตัวบุคคล`
        },
        {
          id: "2-b3",
          text: customPassphrase,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${customPassphrase}" นำคำศัพท์สุ่มที่ไม่มีความสัมพันธ์กันมาเชื่อมต่อด้วยขีดล่าง (_) พร้อมตบท้ายด้วยตัวเลขสุ่ม ซึ่งทำลายลวดลายไวยากรณ์ปกติโดยสิ้นเชิง`
        },
        {
          id: "2-b4",
          text: characterName,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวละครชื่อดังร่วมกับตัวเลขเรียงสากล "${characterName}" มักอยู่ในท็อปรหัสผ่านที่โดนสุ่มเปิดเผยในโลกอินเทอร์เน็ต`
        }
      ],
      learningTip: "วลีรหัสผ่านที่ดีควรเกิดจากการนำคำศัพท์ที่ไม่มีความหมายเกี่ยวข้องกันเลยมาวางต่อกัน เช่น ผัก สี พฤติกรรม ทิศทาง และแยกคำเหล่านั้นด้วยตัวอักษรพิเศษหรือตัวเลขเพื่อทำลายลวดลายไวยากรณ์ปกติ"
    });
  }

  // LEVEL 3: Avoiding Predictable Leet Speak (Time Limit: 6 seconds)
  const l3Variation = Math.random() < 0.5 ? 1 : 2;
  if (l3Variation === 1) {
    const leetWord = `${randomElement(["P@55w0rd!", "S3cr3t!", "L33tSp34k!", "Ad@m!n1"])}${randomDigits(2)}`;
    const standardPhrase = "Th1sIs@Str0ngPw";
    const w1 = randomElement(randomWords);
    let w2 = randomElement(randomWords);
    while (w2 === w1) w2 = randomElement(randomWords);
    const correctVal = `${w1}_${w2.toUpperCase()}_${randomDigits(2)}${randomElement(specialChars)}`;
    const keyWalk = randomElement(keyboardWalks);

    levelsList.push({
      id: 3,
      timeLimit: 6,
      focusTopic: "การแทนที่ตัวอักษรยอดฮิต (Leet Speak Substitutions)",
      questionText: "รหัสผ่านไหน ปลอดภัยสุด",
      options: [
        {
          id: "3-a1",
          text: leetWord,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การแปลงตัวอักษรตามสูตรทั่วไปแบบ "${leetWord}" จะถูกเครื่องมือเดารหัสยุคใหม่แกะย้อนกลับไปหาคำเดิมในพจนานุกรมได้แทบจะทันที`
        },
        {
          id: "3-a2",
          text: standardPhrase,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! ถึงจะยาวและซับซ้อน แต่ "${standardPhrase}" เป็นวลีภาษาอังกฤษที่เป็นที่นิยมและโครงสร้างของคำมีความเป็นระเบียบตามไวยากรณ์เกินไป`
        },
        {
          id: "3-a3",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" นำคำศัพท์สุ่มเชื่อมด้วยขีดล่าง พร้อมสลับตัวพิมพ์ใหญ่เล็กสุ่ม แฮกเกอร์จับแนวทางลูปแทนค่าได้ยากมาก`
        },
        {
          id: "3-a4",
          text: keyWalk,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การลากคีย์บอร์ดแถวตรงเช่น "${keyWalk}" ไร้สิ่งกีดขวางทางระบบ สามารถเดาได้ในเสี้ยววินาที`
        }
      ],
      learningTip: "หลีกเลี่ยงการสลับตัวอักษรแบบซ้ำๆ ซากๆ ที่คาดเดาง่าย เช่น P@ssw0rd, @pple ให้หันมาใช้วิธีต่อวลีด้วยเครื่องหมายพิเศษที่ไม่ซ้ำซาก เช่น ขีดล่าง (_) หรือเครื่องหมายคำถาม (?)"
    });
  } else {
    const personalName = `${randomElement(commonNames)}${randomElement(brandWords)}${randomYear()}!`;
    const carYear = `${randomElement(brandWords)}Camry${randomYear()}`;
    const w1 = randomElement(randomWords);
    let w2 = randomElement(randomWords);
    while (w2 === w1) w2 = randomElement(randomWords);
    let w3 = randomElement(randomWords);
    while (w3 === w1 || w3 === w2) w3 = randomElement(randomWords);
    const correctVal = `${w1}_${w2}_${w3}_${randomDigits(2)}*`;
    const petName = `MyPet${randomElement(["Rover", "Buddy", "Max", "Luna"])}123!`;

    levelsList.push({
      id: 3,
      timeLimit: 6,
      focusTopic: "การหลีกเลี่ยงข้อมูลส่วนตัว (Personal Data Leak)",
      questionText: "รหัสผ่านไหน ปลอดภัยสุด",
      options: [
        {
          id: "3-b1",
          text: personalName,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวอย่าง "${personalName}" ใช้ชื่อสากล แบรนด์ และปีใกล้ตัว ซึ่งแฮกเกอร์สามารถกวาดข้อมูลเหล่านี้มาสุ่มโจมตีจากโปรไฟล์โซเชียลของคุณได้ง่าย`
        },
        {
          id: "3-b2",
          text: carYear,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! แบรนด์สินค้า รถยนต์ และปีคริสต์ศักราช "${carYear}" เป็นรูปแบบที่คนมักตั้งเมื่อนึกคำไม่ออก และอยู่ในท็อปลิสต์เครื่องมือ Brute-force`
        },
        {
          id: "3-b3",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" ทำจากคำสุ่มที่ไม่เกี่ยวข้องกับข้อมูลชีวิตส่วนบุคคลเลย มีความยากในการเชื่อมโยงพฤติกรรมของผู้เล่นอย่างสิ้นเชิง`
        },
        {
          id: "3-b4",
          text: petName,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ชื่อเล่นยอดนิยม ชื่อสัตว์เลี้ยง และตัวเลขยอดฮิต "${petName}" เป็นเป้าหมายหลักของการตอบคำถามความมั่นคงปลอดภัยไซเบอร์`
        }
      ],
      learningTip: "อย่าสร้างรหัสผ่านที่มีข้อมูลส่วนตัว เช่น ชื่อเล่น ทะเบียนรถ เบอร์โทรศัพท์ วันเกิด หรือชื่อสัตว์เลี้ยง เพราะแฮกเกอร์ในปัจจุบันเริ่มสืบประวัติจากข้อมูลสาธารณะของคุณก่อนเป็นอันดับแรก"
    });
  }

  // LEVEL 4: Avoiding Repetitive Patterns (Time Limit: 4 seconds)
  const l4Variation = Math.random() < 0.5 ? 1 : 2;
  if (l4Variation === 1) {
    const cyclicPattern = `${randomElement(["Jk", "Ab", "Xy"])}${randomDigits(1)}${randomElement(specialChars)}${randomElement(["Lm", "Cd", "Zk"])}${randomDigits(1)}${randomElement(specialChars)}${randomElement(["Nq", "Ef", "Wq"])}${randomDigits(1)}${randomElement(specialChars)}`;
    const correctVal = generateHighEntropy(12);
    const repeatedVal = `${randomElement(randomWords)}${randomElement(randomWords).toUpperCase()}!`;
    const sequentialVal = `${randomDigits(9)}abc`;

    levelsList.push({
      id: 4,
      timeLimit: 4,
      focusTopic: "การหลีกเลี่ยงลวดลายซ้ำซ้อน (Pattern Analysis)",
      questionText: "ข้อใดไม่มีรูปแบบซ้ำ ๆ ของการตั้ง Password",
      options: [
        {
          id: "4-a1",
          text: cyclicPattern,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! แม้จะยาก แต่อักขระตัวนี้มีรูปแบบการสลับ [พิมพ์ใหญ่][พิมพ์เล็ก][ตัวเลข][สัญลักษณ์] ที่เป็นโครงซ้ำซ้อนกัน 3 ชุด ทำให้คอมพิวเตอร์วิเคราะห์ระเบียบเจอ`
        },
        {
          id: "4-a2",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" มีการกระจายตัวของอักขระอย่างอิสระ ไม่มีแบบแผนคณิตศาสตร์ที่โปรแกรมวิเคราะห์จับกลุ่มระเบียบประเภทตัวอักษรได้`
        },
        {
          id: "4-a3",
          text: repeatedVal,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การประกบคู่คำเดิมซ้ำสลับตัวอักษร "${repeatedVal}" เจาะผ่านได้อย่างรวดเร็วด้วยโปรแกรมวิเคราะห์รูปแบบพื้นฐาน`
        },
        {
          id: "4-a4",
          text: sequentialVal,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวเลขและอักษรเรียงต่อเนื่องอย่าง "${sequentialVal}" มีอัตราความหนาแน่นของการสุ่มในระดับศูนย์`
        }
      ],
      learningTip: "แฮกเกอร์ใช้เครื่องมือที่วิเคราะห์โครงสร้างรูปแบบ (Pattern Analyzers) รหัสผ่านที่มีโครงสร้างซ้ำๆ เช่น Ab1!Cd2!Ef3! จะถูกแกะได้ไวกว่าแบบที่สุ่มสลับตำแหน่งอย่างแท้จริง"
    });
  } else {
    const sequencePart = `abc123XYZ${randomElement(specialChars).repeat(3)}`;
    const shortRandom = generateHighEntropy(10);
    const symmetric = `A1B2C3D4${randomDigits(2)}`;
    const correctVal = generateHighEntropy(12);

    levelsList.push({
      id: 4,
      timeLimit: 4,
      focusTopic: "ความสุ่มไร้ลวดลาย (Entropy & True Randomness)",
      questionText: "รหัสผ่านไหน ปลอดภัยสุด",
      options: [
        {
          id: "4-b1",
          text: sequencePart,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! โครงสร้างแบ่งพาร์ทที่เรียงชัดเจนอย่าง "${sequencePart}" สามารถเดาได้ง่ายจากการประมวลผลคำศัพท์ผสมสัญลักษณ์ซ้ำ`
        },
        {
          id: "4-b2",
          text: shortRandom,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! สุ่มได้ไร้ระเบียบจริงแต่มีความยาวเพียง 10 อักขระ ซึ่งยังค่อนข้างสั้นเมื่อเจอการประมวลผลความเร็วสูงจากซูเปอร์คอมพิวเตอร์`
        },
        {
          id: "4-b3",
          text: symmetric,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวสลับอักษร-ตัวเลขลำดับสว่างแบบ "${symmetric}" (A-1, B-2...) เป็นรูปแบบเรขาคณิตคีย์บอร์ดที่เดาได้ง่ายมาก`
        },
        {
          id: "4-b4",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" สุ่มระดับเอนโทรปีเต็มพิกัด (True Randomness) ในความยาว 12 อักขระที่ไร้สมมาตรและไร้รูปแบบความสัมพันธ์`
        }
      ],
      learningTip: "รหัสผ่านที่สุ่มแท้จริงต้องไม่มีความเกี่ยวพันทางระบบเลย (เช่น การสลับ ตัวเลข-อักษร-ตัวเลข-อักษร) การสุ่มที่ดีต้องมีความกระจัดกระจายและไร้ระเบียบในทุกตำแหน่ง"
    });
  }

  // LEVEL 5: True Cryptographic Randomness (Time Limit: 3 seconds)
  const l5Variation = Math.random() < 0.5 ? 1 : 2;
  if (l5Variation === 1) {
    const dogVal = `LoveMy${randomElement(animalWords)}${randomDigits(5)}!`;
    const correctVal = generateHighEntropy(14);
    const singleWord = `${randomElement(["supercalifragilistic", "unquestionablysecure", "counterintelligence"])}`;
    const ordered = `AbCdEfGh${randomDigits(5)}!`;

    levelsList.push({
      id: 5,
      timeLimit: 3,
      focusTopic: "รหัสผ่านสุ่มปลอดภัยสูงสุด (High-Entropy)",
      questionText: "รหัสผ่านไหน ปลอดภัยสุด",
      options: [
        {
          id: "5-a1",
          text: dogVal,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! มีสัดส่วนของวลีแสดงความผูกพันและตัวเลขเรียงลำดับ "${dogVal}" ซึ่งแฮกเกอร์ใช้วิธีรวบรวมกลุ่มคำทางจิตวิทยาเจาะระบบได้`
        },
        {
          id: "5-a2",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งสูงสุด! ตัวเลือก "${correctVal}" ประกอบด้วยตัวละครที่สุ่มระดับลึกที่สุดและมีความยาว 14 หลัก ป้องกันการเจาะได้แทบทุกระบบบนโลก`
        },
        {
          id: "5-a3",
          text: singleWord,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! แม้จะยาวมาก แต่ตัวเลือก "${singleWord}" เป็นคำศัพท์คำเดียวที่มีอยู่จริงในสารานุกรมหรือสื่อสาธารณะ แฮกเกอร์ใช้ Dictionary attack แกะได้`
        },
        {
          id: "5-a4",
          text: ordered,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ลำดับความสมมาตรแบบ "${ordered}" มีระดับความต้านทานการเดาลายนิ้วมือคีย์บอร์ดที่ต่ำเกินไป`
        }
      ],
      learningTip: "รหัสผ่านที่สุ่มและไม่มีโครงสร้างความสัมพันธ์กับตัวตนของคุณ (ไม่มีชื่อสัตว์เลี้ยง, วันเกิด, คำในพจนานุกรม) ร่วมกับความยาวและการสลับอักขระ คือสุดยอดเกราะกำบังทางไซเบอร์!"
    });
  } else {
    const adminSecure = `Admin@${randomYear()}_Secure`;
    const correctVal = generateHighEntropy(14);
    const regularKeys = `1234567890${randomElement(["abcde", "asdfg"])}!`;
    const regularSentence = `I_want_to_be_a_${randomElement(["guru", "hero", "king"])}`;

    levelsList.push({
      id: 5,
      timeLimit: 3,
      focusTopic: "ระบบความปลอดภัยต้านทาน Supercomputer",
      questionText: "รหัสผ่านไหน ปลอดภัยสุด",
      options: [
        {
          id: "5-b1",
          text: adminSecure,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การนำคำศัพท์ที่พบบ่อยในฐานระบบเซิร์ฟเวอร์มารวมกันแบบ "${adminSecure}" เป็นรหัสลำดับแรกๆ ที่จะถูกสุ่มโจมตี (Credential Stuffing)`
        },
        {
          id: "5-b2",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งสูงสุด! ตัวเลือก "${correctVal}" ใช้ความกระจัดกระจายของข้อมูล 14 อักขระ สุ่มชนิดไร้ช่องโหว่ทางไวยากรณ์หรือคณิตศาสตร์ คล้ายรหัสที่ระบบรักษารองรับความมั่นคงสูงสุดเลือกใช้`
        },
        {
          id: "5-b3",
          text: regularKeys,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! แป้นพิมพ์มาตรฐานร่วมกับตัวเลขเรียงของ "${regularKeys}" แทบไม่มีความหมายในการป้องกันคอมพิวเตอร์ประมวลผลสุ่ม`
        },
        {
          id: "5-b4",
          text: regularSentence,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! แม้จะเป็น Passphrase และมีความยาว แต่เป็นวลีประโยคตามธรรมชาติที่มีรูปแบบชัดเจนและใช้คำศัพท์ยอดนิยม สามารถเจาะสำเร็จได้ไวกว่าแบบไร้ระเบียบ`
        }
      ],
      learningTip: "ความปลอดภัยระดับทหารและรัฐบาลใช้ความสุ่มระดับเอนโทรปีสูง (High Entropy) รหัสผ่านเหล่านี้จะไม่สามารถจดจำด้วยสมองมนุษย์ธรรมดาได้ จึงต้องอาศัยการเข้ารหัสผ่านระบบจัดเก็บที่ปลอดภัย (Password Manager) เสมอ"
    });
  }

  // Apply difficulty time limit overrides
  levelsList.forEach(level => {
    if (difficulty === 'easy') {
      level.timeLimit = 20;
    } else if (difficulty === 'hard') {
      if (level.id === 1) level.timeLimit = 5;
      else if (level.id === 2) level.timeLimit = 4.5;
      else if (level.id === 3) level.timeLimit = 4;
      else if (level.id === 4) level.timeLimit = 3.5;
      else if (level.id === 5) level.timeLimit = 3;
    } else {
      // medium
      if (level.id === 1) level.timeLimit = 10;
      else if (level.id === 2) level.timeLimit = 8;
      else if (level.id === 3) level.timeLimit = 6;
      else if (level.id === 4) level.timeLimit = 4;
      else if (level.id === 5) level.timeLimit = 3;
    }
  });

  // Shuffle options in each level to prevent key memory of positions
  return levelsList.map(lvl => ({
    ...lvl,
    options: shuffleArray(lvl.options)
  }));
}
