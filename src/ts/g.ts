import { CreateUserDTO } from "./models/CreateUserDTO";
import { Measurement } from "./models/Measurement";
import { ValidateResponse } from "./models/ValidationResponse";

/*
  1. Se om du kan hitta två stycken code smells i följande funktion och rätta till dem.
  Funktionen tar emot en lista med längshoppslängder och syftet med funktionen är att summera
  dessa hopplängder.
  */

function getTotalJumpDistance(jumpDistances: number[]): number {
  if (jumpDistances.length == 0) {
    return 0;
  }
  return jumpDistances.reduce(
    (jumpDistanceSoFar, currentJump) => jumpDistanceSoFar + currentJump
  );
}

/*
  2. I detta exempel har vi fokuserat på if-statements. Se om du kan göra exemplet bättre!
  */

class Student {
  constructor(
    public name: string,
    public handedInOnTime: boolean,
    public passed: boolean
  ) {}
}

function getStudentStatus(student: Student): string {
  let passingStudents: string[] = ['Sebastian'];

  student.passed = passingStudents.includes(student.name) && student.handedInOnTime;

  return student.passed ? 'VG' : 'IG';
}

/*
  3. Variabelnamn är viktiga. Kika igenom följande kod och gör om och rätt.
  Det finns flera code smells att identifiera här. Vissa är lurigare än andra.
  */

// class Temp {
//   constructor(
//     public q: string,
//     public where: Date,
//     public v: number
//     ) {}
// }

// function averageWeeklyTemperature2(heights: Temp[]) {
//   let r = 0;

//   for (let who = 0; who < heights.length; who++) {
//     if (heights[who].q === "Stockholm") {
//       if (heights[who].where.getTime() > Date.now() - 604800000) {
//         r += heights[who].v;
//       }
//     }
//   }

//   return r / 7;
// }

function averageTempLastWeek(measurements: Measurement[]) {
  let today = new Date();
  let sevenDaysAgoInMs = today.getTime() - 1000 * 60 * 60 * 24 * 7;

  let relevantMeasurements = measurements.filter(measurement => measurement.location == 'Stockholm' && measurement.date.getTime() > sevenDaysAgoInMs);

  return relevantMeasurements.reduce((ack, currMeas) => ack + currMeas.temp, 0) / 7;
}

/*
  4. Följande funktion kommer att presentera ett objekt i dom:en. 
  Se om du kan göra det bättre. Inte bara presentationen räknas, även strukturer.
  */

function showProduct(
  name: string,
  price: number,
  imageUrl: string,
  parentElement: HTMLElement
) {
    parentElement.innerHTML += `
      <div>
        <h4>${name}</h4>
        <img src="${imageUrl}">
        <strong>${price}</strong>
      </div>
    `;
}

/*
  5. Följande funktion kommer presentera studenter. Men det finns ett antal saker som 
  går att göra betydligt bättre. Gör om så många som du kan hitta!
  */
function presentStudents(students: Student[]) {
  let listofPassedStudents = document.querySelector("ul#passedstudents") as HTMLElement;
  let listOfFailedStudents = document.querySelector("ul#failedstudents") as HTMLElement;

  for (const student of students) {
    let studentHTML = `
    <li>
      <input type="checkbox" ${student.handedInOnTime? 'checked' : ''}>
      <span>${student.name}</span>
    </li>
  `
    if (student.handedInOnTime) {
      listofPassedStudents.innerHTML += studentHTML;
    } else {
      listOfFailedStudents.innerHTML += studentHTML;
    }
  }
}

/*
  6. Skriv en funktion som skall slå ihop följande texter på ett bra sätt:
  Lorem, ipsum, dolor, sit, amet
  Exemplet under löser problemet, men inte speciellt bra. Hur kan man göra istället?
  */

// Anropet multiConcat(['Lorem', 'ipsum', 'dolor', 'sit', 'amet']) har samma funktionalitet som tidigare funktion
function multiConcat(texts: string[]) {
  return texts.join('');
}

/* 
7. Denna funktion skall kontrollera att en användare är över 20 år och göra någonting.
    Det finns dock problem med denna typ av funktion. Vad händer när kraven ändras och
    fler och fler parametrar behöver läggas till? T.ex. avatar eller adress. Hitta en bättre
    lösning som är hållbar och skalar bättre. 
*/

const AGE_LIMIT = 20;

function createUser(userDTO: CreateUserDTO) {
  let ageValidation = validateAge(userDTO, AGE_LIMIT);

  if (ageValidation.success) {
    // Logik för att skapa en användare
  } else {
    return ageValidation.errorMessage;
  }
}

function validateAge(userDTO: CreateUserDTO, ageLimit: number): ValidateResponse {
  let ageDiff = Date.now() - userDTO.birthday.getTime();
  let ageDate = new Date(ageDiff);
  let userAge = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (userAge >= ageLimit) {
    return new ValidateResponse(true);
  }

  return new ValidateResponse(false, `Du är under ${ageLimit} år`);
}