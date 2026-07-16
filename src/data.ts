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
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type LevelBuilder = () => Omit<Level, 'id' | 'timeLimit'>;

// Pool of 20 distinct Level Builders to provide a diverse selection of safety evaluations
const levelBuilders: LevelBuilder[] = [
  // 1. Character Variety
  () => {
    const correctVal = `P@ss_${randomElement(randomWords)}99!`;
    const numVal = randomDigits(8);
    const wordVal = `${randomElement(randomWords)}${randomDigits(3)}`;
    const phraseVal = `lovemy${randomElement(animalWords)}`;
    return {
      focusTopic: "ประเภทตัวอักษรที่หลากหลาย (Character Variety)",
      questionText: "Password ไหน เดายากที่สุดในกลุ่มนี้",
      options: [
        {
          id: "1-opt-1",
          text: numVal,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวเลขเรียงลำดับ "${numVal}" สามารถถูกเดาได้ในระดับมิลลิวินาทีด้วยคอมพิวเตอร์ทั่วไป`
        },
        {
          id: "1-opt-2",
          text: wordVal,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! คำเดี่ยวภาษาอังกฤษบวกตัวเลขต่อท้าย "${wordVal}" เป็นเป้าหมายแรกๆ ของพจนานุกรมเดารหัสผ่าน`
        },
        {
          id: "1-opt-3",
          text: phraseVal,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! วลีสั้นๆ ทั่วไปแบบ "${phraseVal}" ถูกรวบรวมไว้ในฐานข้อมูลแฮกเกอร์เรียบร้อยแล้ว`
        },
        {
          id: "1-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุดในกลุ่มนี้! ตัวเลือก "${correctVal}" มีการผสมผสานครบทั้งอักษรพิมพ์ใหญ่, พิมพ์เล็ก, สัญลักษณ์ (@, !), ตัวเลข และอักษรปกติ`
        }
      ],
      learningTip: "การใช้อักขระที่หลากหลาย (ตัวพิมพ์ใหญ่, เล็ก, ตัวเลข, สัญลักษณ์) ช่วยเพิ่มความซับซ้อนให้รหัสผ่านอย่างทวีคูณ ทำให้โปรแกรมถอดรหัสผ่านทำงานช้าลงอย่างมาก!"
    };
  },

  // 2. Standard Key Walks
  () => {
    const keyWalk = randomElement(keyboardWalks);
    const repeated = randomElement(["1", "a", "A", "9", "0"]).repeat(8);
    const welcomeYear = `welcome${randomYear()}`;
    const correctVal = generateHighEntropy(8);
    return {
      focusTopic: "การเลี่ยงปุ่มเรียงพยัญชนะ (Standard Key Walks)",
      questionText: "Password ไหน เดายากและไม่มีรูปแบบปุ่มเรียงพยัญชนะ",
      options: [
        {
          id: "2-opt-1",
          text: keyWalk,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การลากนิ้วบนคีย์บอร์ดแถวตรงอย่าง "${keyWalk}" เป็นสิ่งแรกๆ ที่โปรแกรมสแกนอัตโนมัติจะสุ่มป้อน`
        },
        {
          id: "2-opt-2",
          text: repeated,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวอักษรตัวเดิมซ้ำกันเป็นชุด "${repeated}" ไร้ความยากในการคำนวณถอดรหัสอย่างสิ้นเชิง`
        },
        {
          id: "2-opt-3",
          text: welcomeYear,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! คำทักทายทั่วไปคู่กับปีคริสต์ศักราชใกล้ตัว "${welcomeYear}" สามารถเดาได้ง่ายจากพจนานุกรมคำยอดฮิต`
        },
        {
          id: "2-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุดในกลุ่มนี้! ตัวเลือก "${correctVal}" สุ่มสลับตัวอักษรพิมพ์ใหญ่เล็ก อักษรพิเศษ และตัวเลขอย่างไร้ทิศทางและไม่มีรูปแบบบนคีย์บอร์ด`
        }
      ],
      learningTip: "หลีกเลี่ยงการใช้อักษรที่เรียงกันบนคีย์บอร์ด ไม่ว่าจะในแนวตั้ง แนวนอน หรือแนวทแยง เช่น qwerty, asdfgh, zxcvbn เพราะเครื่องมือแฮกรหัสจะสแกนหาลวดลายเหล่านี้ก่อนเสมอ"
    };
  },

  // 3. Password Length vs Complexity
  () => {
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
    return {
      focusTopic: "ความยาวรหัสผ่าน (Password Length vs Complexity)",
      questionText: "รหัสผ่านใด ทนจากการเจาะระบบได้ดีที่สุด ตามหลักวิทยาศาสตร์ (เน้นความยาว)",
      options: [
        {
          id: "3-opt-1",
          text: shortSecure,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ตัวเลือก "${shortSecure}" มีความยาวน้อยเกินไป (น้อยกว่า 8 อักษร) ส่งผลให้ทนแรงค้นหาแบบ Brute force ได้สั้นมาก`
        },
        {
          id: "3-opt-2",
          text: shortComplex,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! ตัวเลือก "${shortComplex}" แม้จะมีครบทุกประเภทตัวละคร แต่มีความยาวค่อนข้างสั้น และมีโครงสร้างวนซ้ำเป็นสัญลักษณ์เดาง่าย`
        },
        {
          id: "3-opt-3",
          text: passphraseVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${passphraseVal}" ใช้รูปแบบประโยควลีสุ่ม (Passphrase) ยาวมากถึง ${passphraseVal.length} ตัวอักษร คอมพิวเตอร์ต้องใช้เวลานับล้านปีในการแฮกสุ่ม`
        },
        {
          id: "3-opt-4",
          text: adminYear,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวเลือก "${adminYear}" เป็นคำศัพท์เชิงระบบที่เป็นเป้าหมายเริ่มต้นยอดนิยมของการโจมตี`
        }
      ],
      learningTip: "ความยาวคือราชา! รหัสผ่านที่ยาวและจำง่าย (Passphrase) เช่น คำสุ่ม 4 คำต่อกัน ปลอดภัยจากการโจมตีแบบ Brute Force มากกว่ารหัสผ่านสั้นๆ ที่ใส่สัญลักษณ์พิเศษเสียอีก"
    };
  },

  // 4. Passphrase Structure
  () => {
    const grammarPhrase = `mynameis${randomElement(commonNames).toLowerCase()}`;
    const lovePhrase = `ilove${randomElement(animalWords)}sanddogs`;
    const w1 = randomElement(randomWords);
    let w2 = randomElement(randomWords);
    while (w2 === w1) w2 = randomElement(randomWords);
    let w3 = randomElement(randomWords);
    while (w3 === w1 || w3 === w2) w3 = randomElement(randomWords);
    const customPassphrase = `${w1}_${w2}_${w3}_${randomDigits(2)}`;
    const characterName = `${randomElement(["superman", "batman", "spiderman", "ironman"])}${randomDigits(5)}`;
    return {
      focusTopic: "โครงสร้าง Passphrase ที่ยอดเยี่ยม (Unrelated Passphrase)",
      questionText: "Passphrase แบบใดปลอดภัยที่สุดในการปกป้องข้อมูลส่วนตัว",
      options: [
        {
          id: "4-opt-1",
          text: grammarPhrase,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ประโยคภาษาอังกฤษที่มีโครงสร้างไวยากรณ์สากล "${grammarPhrase}" ถูกจัดหาและทดสอบในพจนานุกรมประโยคยอดนิยมได้รวดเร็ว`
        },
        {
          id: "4-opt-2",
          text: lovePhrase,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ประโยคแสดงความชอบแบบ "${lovePhrase}" เป็นรูปแบบจิตวิทยาที่แฮกเกอร์มีเครื่องมือในการทำพจนานุกรมสุ่มเจาะจงเฉพาะตัวบุคคล`
        },
        {
          id: "4-opt-3",
          text: customPassphrase,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${customPassphrase}" นำคำศัพท์สุ่มที่ไม่มีความสัมพันธ์กันมาเชื่อมต่อด้วยขีดล่าง (_) พร้อมตบท้ายด้วยตัวเลขสุ่ม ซึ่งทำลายลวดลายไวยากรณ์ปกติโดยสิ้นเชิง`
        },
        {
          id: "4-opt-4",
          text: characterName,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวละครชื่อดังร่วมกับตัวเลขเรียงสากล "${characterName}" มักอยู่ในท็อปรหัสผ่านที่โดนสุ่มเปิดเผยในโลกอินเทอร์เน็ต`
        }
      ],
      learningTip: "วลีรหัสผ่านที่ดีควรเกิดจากการนำคำศัพท์ที่ไม่มีความหมายเกี่ยวข้องกันเลยมาวางต่อกัน เช่น ผัก สี พฤติกรรม ทิศทาง และแยกคำเหล่านั้นด้วยตัวอักษรพิเศษหรือตัวเลขเพื่อทำลายลวดลายไวยากรณ์ปกติ"
    };
  },

  // 5. Predictable Leet Speak
  () => {
    const leetWord = `${randomElement(["P@55w0rd!", "S3cr3t!", "L33tSp34k!", "Ad@m!n1"])}${randomDigits(2)}`;
    const standardPhrase = "Th1sIs@Str0ngPw";
    const w1 = randomElement(randomWords);
    let w2 = randomElement(randomWords);
    while (w2 === w1) w2 = randomElement(randomWords);
    const correctVal = `${w1}_${w2.toUpperCase()}_${randomDigits(2)}${randomElement(specialChars)}`;
    const keyWalk = randomElement(keyboardWalks);
    return {
      focusTopic: "การแทนที่ตัวอักษรยอดฮิต (Leet Speak Substitutions)",
      questionText: "รหัสผ่านที่มีวิธีการใช้ตัวอักษรสะกดเลียนอันไหน เดายากที่สุดและไม่เป็น Pattern ที่จำง่าย",
      options: [
        {
          id: "5-opt-1",
          text: leetWord,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การแปลงตัวอักษรตามสูตรทั่วไปแบบ "${leetWord}" จะถูกเครื่องมือเดารหัสยุคใหม่แกะย้อนกลับไปหาคำเดิมในพจนานุกรมได้แทบจะทันที`
        },
        {
          id: "5-opt-2",
          text: standardPhrase,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! ถึงจะยาวและซับซ้อน แต่ "${standardPhrase}" เป็นวลีภาษาอังกฤษที่เป็นที่นิยมและโครงสร้างของคำมีความเป็นระเบียบตามไวยากรณ์เกินไป`
        },
        {
          id: "5-opt-3",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" นำคำศัพท์สุ่มเชื่อมด้วยขีดล่าง พร้อมสลับตัวพิมพ์ใหญ่เล็กสุ่ม แฮกเกอร์จับแนวทางลูปแทนค่าได้ยากมาก`
        },
        {
          id: "5-opt-4",
          text: keyWalk,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การลากคีย์บอร์ดแถวตรงเช่น "${keyWalk}" ไร้สิ่งกีดขวางทางระบบ สามารถเดาได้ในเสี้ยววินาที`
        }
      ],
      learningTip: "หลีกเลี่ยงการสลับตัวอักษรแบบซ้ำๆ ซากๆ ที่คาดเดาง่าย เช่น P@ssw0rd, @pple ให้หันมาใช้วิธีต่อวลีด้วยเครื่องหมายพิเศษที่ไม่ซ้ำซาก เช่น ขีดล่าง (_) หรือเครื่องหมายคำถาม (?)"
    };
  },

  // 6. Personal Data Leak
  () => {
    const personalName = `${randomElement(commonNames)}${randomElement(brandWords)}${randomYear()}!`;
    const carYear = `${randomElement(brandWords)}Camry${randomYear()}`;
    const w1 = randomElement(randomWords);
    let w2 = randomElement(randomWords);
    while (w2 === w1) w2 = randomElement(randomWords);
    let w3 = randomElement(randomWords);
    while (w3 === w1 || w3 === w2) w3 = randomElement(randomWords);
    const correctVal = `${w1}_${w2}_${w3}_${randomDigits(2)}*`;
    const petName = `MyPet${randomElement(["Rover", "Buddy", "Max", "Luna"])}123!`;
    return {
      focusTopic: "การหลีกเลี่ยงข้อมูลส่วนตัว (Personal Data Leak)",
      questionText: "Password ข้อใดไม่ใช้ข้อมูลที่เชื่อมโยงถึงตัวบุคคล ป้องกันการแฮกเชิงจิตวิทยา",
      options: [
        {
          id: "6-opt-1",
          text: personalName,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวอย่าง "${personalName}" ใช้ชื่อสากล แบรนด์ และปีใกล้ตัว ซึ่งแฮกเกอร์สามารถกวาดข้อมูลเหล่านี้มาสุ่มโจมตีจากโปรไฟล์โซเชียลของคุณได้ง่าย`
        },
        {
          id: "6-opt-2",
          text: carYear,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! แบรนด์สินค้า รถยนต์ และปีคริสต์ศักราช "${carYear}" เป็นรูปแบบที่คนมักตั้งเมื่อนึกคำไม่ออก และอยู่ในท็อปลิสต์เครื่องมือ Brute-force`
        },
        {
          id: "6-opt-3",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" ทำจากคำสุ่มที่ไม่เกี่ยวข้องกับข้อมูลชีวิตส่วนบุคคลเลย มีความยากในการเชื่อมโยงพฤติกรรมของผู้เล่นอย่างสิ้นเชิง`
        },
        {
          id: "6-opt-4",
          text: petName,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ชื่อเล่นยอดนิยม ชื่อสัตว์เลี้ยง และตัวเลขยอดฮิต "${petName}" เป็นเป้าหมายหลักของการตอบคำถามความมั่นคงปลอดภัยไซเบอร์`
        }
      ],
      learningTip: "อย่าสร้างรหัสผ่านที่มีข้อมูลส่วนตัว เช่น ชื่อเล่น ทะเบียนรถ เบอร์โทรศัพท์ วันเกิด หรือชื่อสัตว์เลี้ยง เพราะแฮกเกอร์ในปัจจุบันเริ่มสืบประวัติจากข้อมูลสาธารณะของคุณก่อนเป็นอันดับแรก"
    };
  },

  // 7. Pattern Analysis
  () => {
    const cyclicPattern = `${randomElement(["Jk", "Ab", "Xy"])}${randomDigits(1)}${randomElement(specialChars)}${randomElement(["Lm", "Cd", "Zk"])}${randomDigits(1)}${randomElement(specialChars)}${randomElement(["Nq", "Ef", "Wq"])}${randomDigits(1)}${randomElement(specialChars)}`;
    const correctVal = generateHighEntropy(12);
    const repeatedVal = `${randomElement(randomWords)}${randomElement(randomWords).toUpperCase()}!`;
    const sequentialVal = `${randomDigits(9)}abc`;
    return {
      focusTopic: "การหลีกเลี่ยงลวดลายซ้ำซ้อน (Pattern Analysis)",
      questionText: "รหัสผ่านใดไม่มีลวดลายซ้ำและไร้แบบแผนทางคณิตศาสตร์ ที่นำมาใช้ในการคาดเดาได้",
      options: [
        {
          id: "7-opt-1",
          text: cyclicPattern,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! แม้จะยาก แต่อักขระตัวนี้มีรูปแบบการสลับ [พิมพ์ใหญ่][พิมพ์เล็ก][ตัวเลข][สัญลักษณ์] ที่เป็นโครงซ้ำซ้อนกัน 3 ชุด ทำให้คอมพิวเตอร์วิเคราะห์ระเบียบเจอ`
        },
        {
          id: "7-opt-2",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" มีการกระจายตัวของอักขระอย่างอิสระ ไม่มีแบบแผนคณิตศาสตร์ที่โปรแกรมวิเคราะห์จับกลุ่มระเบียบประเภทตัวอักษรได้`
        },
        {
          id: "7-opt-3",
          text: repeatedVal,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การประกบคู่คำเดิมซ้ำสลับตัวอักษร "${repeatedVal}" เจาะผ่านได้อย่างรวดเร็วด้วยโปรแกรมวิเคราะห์รูปแบบพื้นฐาน`
        },
        {
          id: "7-opt-4",
          text: sequentialVal,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวเลขและอักษรเรียงต่อเนื่องอย่าง "${sequentialVal}" มีอัตราความหนาแน่นของการสุ่มในระดับศูนย์`
        }
      ],
      learningTip: "แฮกเกอร์ใช้เครื่องมือที่วิเคราะห์โครงสร้างรูปแบบ (Pattern Analyzers) รหัสผ่านที่มีโครงสร้างซ้ำๆ เช่น Ab1!Cd2!Ef3! จะถูกแกะได้ไวกว่าแบบที่สุ่มสลับตำแหน่งอย่างแท้จริง"
    };
  },

  // 8. True Cryptographic Randomness
  () => {
    const dogVal = `LoveMy${randomElement(animalWords)}${randomDigits(5)}!`;
    const correctVal = generateHighEntropy(14);
    const singleWord = `${randomElement(["supercalifragilistic", "unquestionablysecure", "counterintelligence"])}`;
    const ordered = `AbCdEfGh${randomDigits(5)}!`;
    return {
      focusTopic: "รหัสผ่านสุ่มปลอดภัยสูงสุด (High-Entropy)",
      questionText: "Password ในระดับความปลอดภัยทางการทหาร ข้อใดทนทานต่อการ Brute force ที่สุด",
      options: [
        {
          id: "8-opt-1",
          text: dogVal,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! มีสัดส่วนของวลีแสดงความผูกพันและตัวเลขเรียงลำดับ "${dogVal}" ซึ่งแฮกเกอร์ใช้วิธีรวบรวมกลุ่มคำทางจิตวิทยาเจาะระบบได้`
        },
        {
          id: "8-opt-2",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งสูงสุด! ตัวเลือก "${correctVal}" ประกอบด้วยตัวละครที่สุ่มระดับลึกที่สุดและมีความยาว 14 หลัก ป้องกันการเจาะได้แทบทุกระบบบนโลก`
        },
        {
          id: "8-opt-3",
          text: singleWord,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! แม้จะยาวมาก แต่ตัวเลือก "${singleWord}" เป็นคำศัพท์คำเดียวที่มีอยู่จริงในสารานุกรมหรือสื่อสาธารณะ แฮกเกอร์ใช้ Dictionary attack แกะได้`
        },
        {
          id: "8-opt-4",
          text: ordered,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ลำดับความสมมาตรแบบ "${ordered}" มีระดับความต้านทานการเดาลายนิ้วมือคีย์บอร์ดที่ต่ำเกินไป`
        }
      ],
      learningTip: "รหัสผ่านที่สุ่มและไม่มีโครงสร้างความสัมพันธ์กับตัวตนของคุณ (ไม่มีชื่อสัตว์เลี้ยง, วันเกิด, คำในพจนานุกรม) ร่วมกับความยาวและการสลับอักขระ คือสุดยอดเกราะกำบังทางไซเบอร์!"
    };
  },

  // 9. Symbol Distribution
  () => {
    const w1 = randomElement(randomWords);
    const w2 = randomElement(randomWords);
    const correctVal = `${w1}${randomElement(specialChars)}${w2}${randomDigits(2)}${randomElement(specialChars)}`;
    const trailingSymbols = `${w1}${w2}${randomDigits(2)}!!!`;
    const startingSymbols = `@@${w1}${w2}${randomDigits(2)}`;
    const normalConcat = `${w1}${w2}${randomDigits(4)}`;
    return {
      focusTopic: "ตำแหน่งและการกระจายสัญลักษณ์พิเศษ (Symbol Distribution)",
      questionText: "การวางสัญลักษณ์พิเศษในรูปแบบใดช่วยป้องกันการโจมตีแบบ Rule-based dictionary ได้ดีที่สุด",
      options: [
        {
          id: "9-opt-1",
          text: trailingSymbols,
          isCorrect: false,
          strength: "moderate",
          reason: `ปานกลาง! การต่อท้ายด้วยเครื่องหมายซ้ำๆ เช่น "!!!" มักโดนสแกนเจอเป็นลำดับแรกจากโปรแกรม Rule-based ที่สแกนรูปแบบยอดนิยม`
        },
        {
          id: "9-opt-2",
          text: startingSymbols,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การใส่สัญลักษณ์ไว้แค่หน้าสุดเช่น "@@" เป็นการตกแต่งที่แฮกเกอร์เขียนกฎกรองหา (Prefix filters) ได้รวดเร็วมาก`
        },
        {
          id: "9-opt-3",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! การสอดแทรกสัญลักษณ์ไว้กลางคำแบบสุ่ม "${correctVal}" ป้องกันการใช้ระบบค้นหาคำศัพท์ตามพจนานุกรมได้อย่างดีเยี่ยม`
        },
        {
          id: "9-opt-4",
          text: normalConcat,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การต่อสองคำเดี่ยวด้วยตัวเลขเฉยๆ ไม่มีสัญลักษณ์พิเศษ คาดเดาได้ง่ายมากในพริบตา`
        }
      ],
      learningTip: "อย่าแค่ใส่สัญลักษณ์พิเศษไว้หน้าสุดหรือหลังสุดของรหัสผ่าน! การกระจายหรือสอดแทรกสัญลักษณ์พิเศษไว้ระหว่างกลางคำศัพท์สุ่ม ช่วยทำลายลวดลายโครงสร้างคำเดิม ปลอดภัยขึ้นอย่างมาก"
    };
  },

  // 10. Character Repetition
  () => {
    const repeatLetter = randomElement(["a", "s", "x", "e"]).repeat(10);
    const repeatNumber = randomElement(["1", "9", "5", "0"]).repeat(10);
    const correctVal = `R3p_n0t_S@f3_9${randomDigits(2)}!`;
    const patternLetter = "ababababab";
    return {
      focusTopic: "การเลี่ยงการกดปุ่มซ้ำซาก (Character Repetition)",
      questionText: "รหัสผ่านใดหลีกเลี่ยงการใช้อักษรหรือแพทเทิร์นกดซ้ำที่มีช่องโหว่สูง",
      options: [
        {
          id: "10-opt-1",
          text: repeatLetter,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การพิมพ์ตัวอักษรตัวเดิมซ้ำกันยาวๆ "${repeatLetter}" ไม่ช่วยเพิ่มระดับเอนโทรปีหรือความยากในการคำนวณเลย`
        },
        {
          id: "10-opt-2",
          text: repeatNumber,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวเลขตัวเดียวกันต่อเนื่อง "${repeatNumber}" คาดเดาได้ทันทีจากอัลกอริทึมแฮกขั้นพื้นฐาน`
        },
        {
          id: "10-opt-3",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" ปราศจากลวดลายซ้ำซาก และผสมสัญลักษณ์พร้อมตบท้ายด้วยตัวเลขสุ่มที่เดาได้ยาก`
        },
        {
          id: "10-opt-4",
          text: patternLetter,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! รูปแบบการสลับคีย์สลัดซ้ำกันอย่าง "${patternLetter}" มีแบบแผนชัดเจนจนคอมพิวเตอร์แกะเจอง่าย`
        }
      ],
      learningTip: "รหัสผ่านที่มีอักษรตัวเดียวกันซ้ำๆ หรือการพิมพ์สลับปุ่มคู่เดิมซ้ำๆ (เช่น ababab) ถือเป็นจุดอ่อนร้ายแรง การสลับประเภทอักษรไปมาแบบไร้แบบแผนช่วยปิดจุดโหว่นี้ได้"
    };
  },

  // 11. Historical Dates
  () => {
    const datePass1 = `${randomElement(randomWords)}_1914!`;
    const datePass2 = `${randomElement(randomWords)}_2025!`;
    const datePass3 = `${randomElement(randomWords)}_1945_WW`;
    const correctVal = `${randomElement(randomWords)}_${randomDigits(2)}_${randomElement(randomWords).toUpperCase()}`;
    return {
      focusTopic: "การเลี่ยงปีสำคัญหรือวันเดือนปีเกิด (Predictable Years/Dates)",
      questionText: "Password ข้อใดไม่มีส่วนประกอบของปีสำคัญหรือตัวเลขที่ใช้กันทั่วไปตามประวัติศาสตร์",
      options: [
        {
          id: "11-opt-1",
          text: datePass1,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ปีเริ่มต้นสงครามโลกครั้งที่ 1 (1914) ร่วมกับคำศัพท์เป็นเป้าหมายเดารหัสที่แฮกเกอร์ใช้ Brute force ดึงข้อมูลฐานเวลาสำคัญมาเดา`
        },
        {
          id: "11-opt-2",
          text: datePass2,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การใช้ปีปัจจุบันหรือปีใกล้ตัวคริสต์ศักราชอย่าง "${datePass2}" มักโดนสุ่มเจอง่ายเนื่องจากคนตั้งรหัสนิยมใช้จำแนกช่วงปี`
        },
        {
          id: "11-opt-3",
          text: datePass3,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ปีสิ้นสุดสงครามโลกครั้งที่ 2 (1945) ร่วมกับอักษรคีย์เวิร์ด มีโครงสร้างที่คาดเดาได้ตามกระแสประวัติศาสตร์`
        },
        {
          id: "11-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" เป็นคำสุ่มต่อด้วยตัวเลขสุ่มที่ไร้ความเกี่ยวข้องกับประวัติศาสตร์หรือช่วงปีศักราชยอดนิยม`
        }
      ],
      learningTip: "หลีกเลี่ยงการใช้ตัวเลขปีศักราชคริสต์ศักราชที่สำคัญ (เช่น 1945, 1999, 2000, 2025) หรือปีเกิดลงในรหัสผ่าน เพราะระบบแฮกเกอร์ยุคใหม่มีการจัดกลุ่มปีคริสต์ศักราชเหล่านี้มาใช้สแกนก่อนเสมอ"
    };
  },

  // 12. Predictable Acronyms
  () => {
    const acronym1 = `TGIF_${randomYear()}!`;
    const acronym2 = `YOLO_sw@g_123`;
    const acronym3 = `ASAP_emergency_${randomDigits(1)}`;
    const correctVal = generateHighEntropy(11);
    return {
      focusTopic: "การเลี่ยงอักษรย่อคำฮิต (Predictable Acronyms)",
      questionText: "รหัสผ่านใดไม่มีการใช้ตัวย่อจำพวกคำพูดยอดฮิตหรือประโยคสื่อสารยอดนิยม",
      options: [
        {
          id: "12-opt-1",
          text: acronym1,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! อักษรย่อยอดฮิต TGIF (Thank God It's Friday) คู่กับตัวเลขปี เป็นโครงสร้างแสนเชยที่แฮกเกอร์สแกนหาได้เร็ว`
        },
        {
          id: "12-opt-2",
          text: acronym2,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! คำแสลงวัยรุ่นและประโยคคำย่อ YOLO (You Only Live Once) คาดเดาได้ง่ายจากฐานพจนานุกรมโซเชียลมีเดีย`
        },
        {
          id: "12-opt-3",
          text: acronym3,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การใช้คำย่อ ASAP ร่วมกับคำศัพท์ภาษาอังกฤษทั่วไป เดาง่ายมากเนื่องจากความถี่ในการใช้งานตามอีเมลและที่ทำงานสูง`
        },
        {
          id: "12-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" เป็นรหัสสุ่มเอนโทรปีเต็มพิกัด ไร้ร่องรอยของอักษรย่อทางสังคมหรือคำสแลง`
        }
      ],
      learningTip: "อักษรย่อหรือสแลงยอดนิยมทางอินเทอร์เน็ต เช่น ASAP, TGIF, YOLO, LMAO มักมีโครงสร้างที่ง่ายและเป็นฐานข้อมูลแรกๆ ที่ระบบแฮกอัตโนมัติจะนำมาประกอบสุ่มโจมตี"
    };
  },

  // 13. Reversed Words
  () => {
    const revWord1 = "eeffoc_123!"; // coffee
    const revWord2 = "retupmoc_99"; // computer
    const revWord3 = "dr@wyek_!";    // keyboard
    const correctVal = `${randomElement(randomWords)}_${randomElement(animalWords)}_&_${randomDigits(2)}`;
    return {
      focusTopic: "การหลีกเลี่ยงคำกลับหลังสะกดกลับด้าน (Reversed Words Pitfall)",
      questionText: "Password ข้อใดไม่อาศัยคำในพจนานุกรมที่สะกดกลับด้านซึ่งแฮกเกอร์แกะย้อนรอยได้",
      options: [
        {
          id: "13-opt-1",
          text: revWord1,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การสะกดกลับด้านของคำว่า "coffee" ร่วมกับเลขยอดฮิต จะถูกเครื่องมือแฮกรุ่นใหม่วิเคราะห์ทิศทางย้อนรอยสะกดคำปกติได้ในเสี้ยววินาที`
        },
        {
          id: "13-opt-2",
          text: revWord2,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การสะกดกลับด้านของ "computer" แทบไร้ประโยชน์ในการป้องกันตัว เพราะพจนานุกรมแฮกเกอร์ได้รวมคำกลับด้านยอดนิยมไว้หมดแล้ว`
        },
        {
          id: "13-opt-3",
          text: revWord3,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! แม้จะสลับสัญลักษณ์ แต่การย้อนกลับของ "keyboard" เป็นแพทเทิร์นยอดฮิตที่ระบบ Brute force ตรวจหาแบบ Reverse check ได้`
        },
        {
          id: "13-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! การเลือกวลีคำศัพท์สุ่มเชื่อมตัวสัญลักษณ์และตัวเลขตามความปลอดภัยระดับสูง ไม่พึ่งพาการสลับคำสะกดกลับหลังที่โปรแกรมเดาทางได้`
        }
      ],
      learningTip: "การกลับด้านคำสะกด เช่น สะกดจากหลังมาหน้า เป็นจุดที่คนตั้งรหัสพยายามใช้เพื่อแก้ปัญหาความจำเจ แต่แฮกเกอร์รู้ทัน จึงมีโหมดค้นหาแบบ 'Reverse Dictionary Check' สแกนจับได้ง่ายๆ"
    };
  },

  // 14. Phonetic & Pronounceable Passwords
  () => {
    const pronounceable1 = "malikato_semina_55";
    const pronounceable2 = "pajamatoki_123!";
    const pronounceable3 = "kolorita_dragon";
    const correctVal = generateHighEntropy(12);
    return {
      focusTopic: "การเลี่ยงรหัสผ่านที่ออกเสียงเป็นคำๆ ได้ (Phonetic Pronounceability)",
      questionText: "รหัสผ่านใดไม่มีโครงสร้างอักษรที่เป็นสระ ออกเสียงเป็นคำหรืออ่านเป็นวลีได้ง่าย (เน้นความสุ่มแบบธรรมชาติ)",
      options: [
        {
          id: "14-opt-1",
          text: pronounceable1,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! รหัสสะกดลื่นไหลออกเสียงได้ตามสระธรรมชาติแฝงคำยอดนิยม สามารถสแกนและถอดโครงสร้างได้ในระยะสั้นมาก`
        },
        {
          id: "14-opt-2",
          text: pronounceable2,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! โครงสร้างพยางค์สระเด่นชัดช่วยให้คนจำง่าย แต่อัลกอริทึมเดาทางตัวละครจะจัดหมวดหมู่ตรวจสอบได้เร็วกว่าตัวสุ่ม`
        },
        {
          id: "14-opt-3",
          text: pronounceable3,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! เป็นคำอ่านสะกดง่ายที่มีสัดส่วนโครงสร้างพยางค์ทั่วไปในกลุ่มพจนานุกรมสากล`
        },
        {
          id: "14-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "very-strong",
          reason: `แข็งแกร่งที่สุด! ตัวเลือก "${correctVal}" ปราศจากความเกี่ยวเนื่องกับการออกเสียงสระปกติของมนุษย์ สุ่มไร้ระเบียบโดยสมบูรณ์`
        }
      ],
      learningTip: "รหัสผ่านที่สะกดออกเสียงเป็นพยางค์ภาษาอังกฤษง่ายๆ ออกเสียงลื่นหู (เช่น malikato) มักเกิดจากการเรียงตัวอักษรตามไวยากรณ์สระ (สระสลับพยัญชนะ) ซึ่งลดทอนระดับความสุ่มในทางคณิตศาสตร์ลงอย่างมาก"
    };
  },

  // 15. Capitalization Pitfalls
  () => {
    const capitalizeFirst = `${randomElement(randomWords).charAt(0).toUpperCase()}${randomElement(randomWords).slice(1)}${randomDigits(3)}!`;
    const allLower = `${randomElement(randomWords)}${randomElement(randomWords)}${randomDigits(2)}`;
    const allUpper = `${randomElement(randomWords).toUpperCase()}${randomDigits(2)}!`;
    const correctVal = `c${randomElement(randomWords).toUpperCase()}_${randomDigits(2)}p${randomElement(specialChars)}S`;
    return {
      focusTopic: "การสลับพิมพ์ใหญ่-เล็กไร้รูปแบบ (Unpredictable Capitalization)",
      questionText: "รหัสผ่านใดมีรูปแบบการสลับพิมพ์ใหญ่-เล็กที่คาดเดาได้ยากที่สุด ไม่เป็นแพทเทิร์นทั่วไป",
      options: [
        {
          id: "15-opt-1",
          text: capitalizeFirst,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การพิมพ์ตัวพิมพ์ใหญ่เฉพาะตัวแรกสุดของคำ ตามหลักภาษาปกติ "${capitalizeFirst}" เป็นสิ่งแรกๆ ที่โปรแกรมสแกนจัดเรียงสุ่ม`
        },
        {
          id: "15-opt-2",
          text: allLower,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ตัวอักษรพิมพ์เล็กทั้งหมดร่วมกับตัวเลขท้ายคำ เดาออกง่ายและทนแรงประมวลผลของ Brute-force ได้ต่ำมาก`
        },
        {
          id: "15-opt-3",
          text: allUpper,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ตัวอักษรพิมพ์ใหญ่ทั้งหมดพร้อมตัวเลขท้ายคำ ไม่มีความสลับสับเปลี่ยนประเภทอักษรที่เดายาก`
        },
        {
          id: "15-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! การนำอักษรพิมพ์ใหญ่วางสอดแทรกไว้กลางคำสลับตัวพิมพ์เล็กแบบไร้โครงสร้างสากล "${correctVal}" ช่วยเพิ่มระดับความปลอดภัยขึ้นสูงสุด`
        }
      ],
      learningTip: "ผู้ใช้งานส่วนใหญ่มักกด Shift พิมพ์ใหญ่ที่อักษรตัวแรกสุดของรหัสผ่านเสมอ แฮกเกอร์จึงพัฒนาโปรแกรมให้ทดสอบกฎพิมพ์ใหญ่เฉพาะตัวแรกเป็นหลัก การสลับพิมพ์ใหญ่ออกนอกรูปแบบปกติจึงทนต่อการเจาะมากกว่า"
    };
  },

  // 16. Keyboard Spatial Patterns
  () => {
    const pattern1 = "1qaz2wsx3edc";
    const pattern2 = "qazxswedcvfr";
    const pattern3 = "7894561230";
    const correctVal = generateHighEntropy(10);
    return {
      focusTopic: "เรขาคณิตแป้นพิมพ์ (Keyboard Spatial Patterns)",
      questionText: "รหัสผ่านใดหลีกเลี่ยงการกดปุ่มเป็นเส้นตรง เส้นทแยง หรือรูปทรงบนหน้าแป้นพิมพ์",
      options: [
        {
          id: "16-opt-1",
          text: pattern1,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การลากนิ้วเฉียงลงสลับปุ่มตัวเลข (1-q-a-z) เป็นรูปแบบเชิงพื้นที่ยอดนิยมที่อัลกอริทึมแฮกเดาทางเป็นกลุ่มแรก`
        },
        {
          id: "16-opt-2",
          text: pattern2,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การลากคีย์บอร์ดสลับฟันปลาเรียงเป็นคลื่นเป็นหนึ่งในชุดรหัสผ่านที่โดนทดสอบมากที่สุดในโลกอินเทอร์เน็ต`
        },
        {
          id: "16-opt-3",
          text: pattern3,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การกดตัวเลขเรียงบล็อกตามตำแหน่งบน Numpad (7-8-9) ถูกแกะออกมาในพริบตาผ่านระบบตรวจสอบพิกัด`
        },
        {
          id: "16-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! การสุ่มอักขระที่กระจัดกระจายและไม่เรียงเป็นเส้นตรงหรือรูปทรงตามตารางปุ่มแป้นพิมพ์คอมพิวเตอร์อย่าง "${correctVal}"`
        }
      ],
      learningTip: "หลีกเลี่ยงการวาดนิ้วเป็นเส้นเฉียง ลูปวงกลม หรือรูปกล่องบนคีย์บอร์ด (เช่น qazxsw) แม้จะดูเหมือนยากและไม่มีความหมายเป็นภาษา แต่โปรแกรมเจาะระบบมีการจัดกลุ่มข้อมูลลายมือเรขาคณิตแป้นพิมพ์มาประมวลผลสม่ำเสมอ"
    };
  },

  // 17. Predictable Suffixes
  () => {
    const suffix1 = `${randomElement(randomWords)}123!`;
    const suffix2 = `${randomElement(randomWords)}!!!`;
    const suffix3 = `${randomElement(randomWords)}@2026`;
    const correctVal = `${randomDigits(2)}_${randomElement(randomWords)}_#_${randomElement(animalWords)}`;
    return {
      focusTopic: "ตัวต่อท้ายยอดฮิตในรหัสผ่าน (Predictable Suffix Patterns)",
      questionText: "รหัสผ่านในข้อใดไม่ได้พึ่งพาพฤติกรรมการต่อท้ายยอดฮิต ของผู้ใช้ทั่วไป",
      options: [
        {
          id: "17-opt-1",
          text: suffix1,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! สัญชาตญาณมนุษย์มักตบท้ายคำปกติด้วยตัวเลข "123!" อัลกอริทึมเดารหัสผ่านจึงรวบรวมรูปแบบนี้มาสุ่มป้อนได้ไวที่สุด`
        },
        {
          id: "17-opt-2",
          text: suffix2,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การกดเครื่องหมายตกใจซ้ำสามครั้ง "!!!" ท้ายรหัสเป็นแพทเทิร์นที่จำเจและช่วยเพิ่มความยากของรหัสน้อยมากในปัจจุบัน`
        },
        {
          id: "17-opt-3",
          text: suffix3,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! สัญลักษณ์ @ ตามด้วยปีคริสต์ศักราชใหม่ล่าสุด "@2026" ท้ายคำเป็นสิ่งที่โดนเดาเป็นอันดับต้นๆ เมื่อขึ้นปีศักราชใหม่`
        },
        {
          id: "17-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! การกระจายตำแหน่งตัวเลขและสัญลักษณ์พิเศษสุ่มไว้จุดเริ่มและระหว่างคำสุ่มอย่าง "${correctVal}" ไร้รูปแบบคำท้ายเดาง่าย`
        }
      ],
      learningTip: "ผู้ใช้คอมพิวเตอร์กว่า 80% มักใส่ตัวเลขหรือสัญลักษณ์พิเศษ เช่น '123!' หรือ '!!!' ไว้ท้ายรหัสผ่านเสมอ แฮกเกอร์จึงตั้งค่าโปรแกรมให้คาดเดาจากลวดลายยอดฮิตตัวนี้ การพยายามขยับตำแหน่งไปอยู่ต้นหรือกลางคำจึงปลอดภัยกว่า"
    };
  },

  // 18. Compound Dictionary Words
  () => {
    const compound1 = `${randomElement(randomWords)}${randomElement(randomWords)}`;
    const compound2 = `${randomElement(randomWords)}${randomElement(randomWords)}123`;
    const compound3 = `${randomElement(randomWords).toUpperCase()}${randomElement(randomWords).toLowerCase()}`;
    const correctVal = `${randomElement(randomWords)}_${randomElement(randomWords).toUpperCase()}!${randomDigits(2)}`;
    return {
      focusTopic: "การนำคำศัพท์สองคำมาสมาสชนกันโดยตรง (Compound Dictionary Words)",
      questionText: "Password ข้อใดปิดช่องโหว่จากการใช้คำใน Dictionary โดยไม่มีเครื่องหมายคั่นกลาง",
      options: [
        {
          id: "18-opt-1",
          text: compound1,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การรวมคำศัพท์ภาษาอังกฤษสองคำเข้าด้วยกันตรงๆ จะไม่สามารถต้านทานระบบแฮกแบบวิเคราะห์คำศัพท์ผสม (Combinator Dictionary attack) ได้`
        },
        {
          id: "18-opt-2",
          text: compound2,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! แม้จะใส่ตัวเลขท้ายคำเดนชัด แต่โครงสร้างคำสมาสภาษาอังกฤษติดกันเป็นคำเป้าหมายของการโจมตีผสม`
        },
        {
          id: "18-opt-3",
          text: compound3,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! ถึงแม้จะมีการสลับตัวพิมพ์ใหญ่และเล็กในจุดเริ่มชนคำศัพท์ แต่การเรียงศัพท์สมบูรณ์ของสองคำรวมก็ยังเดาง่าย`
        },
        {
          id: "18-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! การใช้ตัวคั่นสัญลักษณ์พิเศษอย่างขีดล่าง (_) ขัดโครงสร้างศัพท์พร้อมสุ่มสลับตัวเลขและเครื่องหมายประเจิดประเจ้ออย่าง "${correctVal}"`
        }
      ],
      learningTip: "การรวมกันของคำศัพท์สองคำ เช่น 'coffeebridge' จะถูกระบบเจาะรหัสผสมคำ (Combinatorial attack) ทะลวงได้อย่างรวดเร็ว ควรคั่นคำเหล่านี้ด้วยตัวเลขหรือเครื่องหมายพิเศษเสมอเพื่อรบกวนโครงสร้างคำดั้งเดิม"
    };
  },

  // 19. Numerical Sequences
  () => {
    const seq1 = "2468101214";
    const seq2 = "135791113";
    const seq3 = "1122334455";
    const correctVal = `N_uM_${randomDigits(2)}_r_${randomDigits(2)}!`;
    return {
      focusTopic: "ตัวเลขเรียงคณิตศาสตร์ (Arithmetic Numerical Sequences)",
      questionText: "รหัสผ่านใดไม่มีการระบุตัวเลข ตามแบบแผนทางคณิตศาสตร์",
      options: [
        {
          id: "19-opt-1",
          text: seq1,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การเรียงเลขคู่คณิตศาสตร์ต่อเนื่อง "${seq1}" มีแบบแผนอัลกอริทึมรองรับให้ค้นพบได้อย่างรวดเร็ว`
        },
        {
          id: "19-opt-2",
          text: seq2,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! ลำดับเลขคี่คณิตศาสตร์ต่อท้ายกันเป็นชุดมีอัตราความยากในการสแกนเป็นศูนย์`
        },
        {
          id: "19-opt-3",
          text: seq3,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! การเรียงตัวเลขเบิ้ลคู่ตามระเบียบเชิงพื้นที่ง่าย มีจุดบกพร่องที่ทำให้ถอดรหัสได้ทันที`
        },
        {
          id: "19-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! มีการผสมผสานอักขระสลับตำแหน่งพร้อมตัวเลขที่ปราศจากความสัมพันธ์เชิงเส้นตรงทางคณิตศาสตร์`
        }
      ],
      learningTip: "หลีกเลี่ยงการใช้ลำดับเลขคู่ เลขคี่ เลขยกกำลัง หรือเลขตารางแบบสมมาตร (เช่น 2468, 112233) ระบบ Brute-force อัตโนมัติในปัจจุบันสามารถกรองหาลวดลายคณิตศาสตร์สั้นเหล่านี้ได้ในเสี้ยววินาที"
    };
  },

  // 20. Default Credentials
  () => {
    const default1 = "admin@2026_pass";
    const default2 = "administrator_secure";
    const default3 = "root_access_needed";
    const correctVal = generateHighEntropy(13);
    return {
      focusTopic: "ค่าระบบสากลเริ่มต้นหลีกเลี่ยง (System Default Credentials Pitfall)",
      questionText: "รหัสผ่านใดไม่มีคำศัพท์เชิงระบบเริ่มต้น ที่มักถูกเดาได้โดยตรง",
      options: [
        {
          id: "20-opt-1",
          text: default1,
          isCorrect: false,
          strength: "very-weak",
          reason: `อ่อนแอมาก! คำเด่นชัดเชิงแอดมินอย่าง "admin" เป็นสิ่งแรกสุดที่แฮกเกอร์ใช้โจมตีในแบบสุ่มข้อมูลแบบครอบหัว (Credential Stuffing)`
        },
        {
          id: "20-opt-2",
          text: default2,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! คำว่า "administrator" เป็นคำเฉพาะทางเครือข่ายความปลอดภัยคอมพิวเตอร์ มีความเสี่ยงสูญเสียบัญชีระดับสูง`
        },
        {
          id: "20-opt-3",
          text: default3,
          isCorrect: false,
          strength: "weak",
          reason: `อ่อนแอ! การใช้คีย์เวิร์ดแฮกระดับราก "root" เป็นสิ่งแรกๆ ที่โปรแกรมอัตโนมัติจะโจมตีช่องพอร์ตเว็บและเซิร์ฟเวอร์`
        },
        {
          id: "20-opt-4",
          text: correctVal,
          isCorrect: true,
          strength: "strong",
          reason: `แข็งแกร่งที่สุด! รหัสสุ่มแท้ที่ไม่มีคำบ่งชี้ระบบแอดมิน ป้องกันการถูกโจมตีแบบเจาะจงเป้าหมายบัญชีผู้ดูแล`
        }
      ],
      learningTip: "คำศัพท์จำพวก admin, root, administrator, user, guest, password, support มักถูกรวบรวมขึ้นมาเป็นท็อปลิสต์สำหรับเจาะเข้าระบบแบบหว่านแห หลีกเลี่ยงคำเหล่านี้เด็ดขาดแม้จะประดับตัวอักษรพิเศษเพิ่มก็ตาม"
    };
  }
];

/**
 * Dynamically generates a custom 5-stage level set randomly chosen from a pool of 20
 * beautiful interactive questions. It accepts optional custom time limits for extreme configuration flexibility.
 */
export function generateRandomGame(difficulty: Difficulty = 'medium', customTimes?: number[]): Level[] {
  // Create full index pool 0 to 19
  const indices = Array.from({ length: levelBuilders.length }, (_, i) => i);
  
  // Shuffle indices to pick 5 unique random ones
  const shuffledIndices = shuffleArray(indices);
  const chosenIndices = shuffledIndices.slice(0, 5);

  const levelsList: Level[] = chosenIndices.map((idx, index) => {
    const builder = levelBuilders[idx];
    const partial = builder();
    
    // Determine timeLimit
    let timeLimit = 10; // default fallback
    if (customTimes && customTimes[index] !== undefined) {
      timeLimit = customTimes[index];
    } else {
      if (difficulty === 'easy') {
        timeLimit = 15;
      } else if (difficulty === 'hard') {
        const hardDefaults = [5, 4.5, 4, 3.5, 3];
        timeLimit = hardDefaults[index];
      } else {
        // medium
        const mediumDefaults = [10, 8, 6, 4, 3];
        timeLimit = mediumDefaults[index];
      }
    }

    return {
      id: index + 1,
      timeLimit: parseFloat(timeLimit.toFixed(1)),
      ...partial,
      options: shuffleArray(partial.options)
    };
  });

  return levelsList;
}
