import { COMPANY } from "@/data/company";

/**
 * Legal wording, transcribed from the company's Driver Qualification packet
 * (pages 8-12, 17, 19 and 20). Where the source had a plain typo it is corrected;
 * everything else is word for word. Do not paraphrase these without legal review.
 */
export interface LegalSection {
  heading?: string;
  paragraphs: string[];
}

const CO = COMPANY.legalName;

export const NOTICE_TO_APPLICANT: LegalSection[] = [
  {
    heading: "Notice to applicant",
    paragraphs: [
      "This employer complies with the Americans with Disabilities Act of 1990. During the interview process you may be asked questions concerning your ability to perform job-related functions. If you are given a conditional offer of employment you may be required to complete a post-job offer medical history questionnaire and / or undergo a medical examination. If required, all entering employees in the same job category will be subject to the same medical questionnaire and / or examination. All information will be kept confidential and in separate files.",
      "Applicants accepted for employment should clearly understand that while we make an effort to provide steady, continuous work, we have no employment contracts and we cannot guarantee the permanence of any position. Job tenure can be affected by many factors including business / economic conditions, changes in laws or employer policies, conformity to our work rules, job performance, etc., and of course, employees may elect to leave of their own accord to seek other employment.",
      "We conduct our business with the highest possible degree of safety and efficiency. Because of this, the employer may require applicants for employment to undergo blood and / or urinalysis screening for drug and alcohol use as part of our pre-placement examination. In addition, all employees of the employer are subject to random blood tests and / or urinalysis screening for drug or alcohol use.",
    ],
  },
  {
    heading: "Applicant's statement",
    paragraphs: [
      `I certify that the answers given herein are true and complete to the best of my knowledge. I authorize the investigation of my background and all matters contained in this application and hereby give ${CO} permission to contact schools, previous employers, references, and others, and hereby release ${CO} from any liability as a result of such contact and release all such persons or companies or corporations supplying information from all liability for all damages on account of supplying such information. I understand that misrepresentations, omissions or facts or incomplete information requested in this application may remove me from further consideration for employment or, if employed by ${CO}, may result in termination of my employment. I agree to furnish such additional information and complete such examinations as may be required to complete this application.`,
      `In consideration of my employment, I agree to conform to the rules and regulations of ${CO} I understand that my employment with ${CO} is for no specific term, and that my employment, compensation, and benefits can be terminated, with or without cause, and with or without notice, at any time, for any reason, at the option of ${CO} or employee.`,
      `I further understand that no oral promise, ${CO} policy, custom, business practice or other procedure (including ${CO}'s Employee Handbook or any personnel manuals) constitutes an employment contract or modification of the at-will employment relationship between ${CO} or employee.`,
      `The contents of any Employee Handbook or personnel manuals, as well as other ${CO} policies and practices, are subject to change or modification by ${CO}, solely at its discretion, without notice.`,
      `I also understand that no manager, supervisor, or company representative(s) other than ${CO} Directors, has any authority to enter into any employment agreement for any specified time period, or to make any oral or written agreement contrary to the foregoing.`,
      `I understand all notices to applicants above, and I agree to submit to testing for drug or alcohol use in accordance with ${CO}'s policies.`,
      `This certifies that this application was completed by me, and that all entries on it and information in it are true and complete to the best of my knowledge. I authorize ${CO} to make investigations and inquiries of my personal, employment, financial or medical history and other related matters as may be necessary in arriving at an employment decision. (Generally, inquiries regarding medical history will be made only if and after a conditional offer of employment has been extended.)`,
      "I hereby release employers, schools, health care providers and other persons from all liability in responding to inquiries and releasing information in connection with my application.",
      `In the event of employment, I understand that false or misleading information given in my application or interview(s) may result in discharge. I understand also that I am required to abide by all rules and regulations of ${CO}`,
    ],
  },
  {
    paragraphs: [
      "This application will remain active for 183 days. Any applicant wishing to be considered for employment beyond this time should reapply.",
      `${CO} is an equal opportunity employer. We adhere to a policy of making employment decisions without regard to race, color, age, sex, sexual orientation, religion, national origin, disability, veteran or marital status, or condition protected by applicant's federal or state statuses, except where a bona fide occupational qualification exists.`,
      `Your opportunity for employment with ${CO} depends solely upon your qualifications.`,
    ],
  },
];

export const ESIGN_AGREEMENT: LegalSection[] = [
  {
    heading: "Electronic signature agreement",
    paragraphs: [
      'The parties acknowledge and agree that this Application and all attached documents related to this Application, including this Electronic Signature Agreement, may be executed by electronic signature, which shall be considered as an original signature for all purposes and shall have the same force and effect as an original signature. Without limitation, "electronic signature" shall include faxed versions of an original signature, electronically scanned and transmitted versions (for example, via a PDF) of an original signature, or an email version of an original signature.',
    ],
  },
];

export const FCRA_DISCLOSURE: LegalSection[] = [
  {
    heading: "Fair Credit Reporting Act disclosure statement",
    paragraphs: [
      "In accordance with the provisions of Section 604(b)(2)(A) of the Fair Credit Reporting Act, Public Law 91-508, as amended by the Consumer Credit Reporting Act of 1996 (Title II, Subtitle D, Chapter I, of Public Law 104-208), you are being informed that reports verifying your previous employment, previous drug and alcohol test results, and your driving record may be obtained on you for employment purposes.",
      "These reports are required by Sections 382.413, 391.23, and 391.25 of the Federal Motor Carrier Safety Regulations.",
    ],
  },
];

/** `employers` is the applicant's previous employers, already joined into a readable list. */
export function releaseOfInformation(employers: string): LegalSection[] {
  return [
    {
      heading: "Authorization of release of information",
      paragraphs: [
        `I hereby authorize ${employers} to release all information as to my character, work habits, performance, experience, fitness, together with reasons for termination concerning my employment with ${employers} (or their authorized agents) which may request such information in connection with my application for employment with ${CO}`,
        `In conformity with 49 CFR Part 40, I hereby authorize ${employers} and their agents to furnish ${CO} the above requested information concerning DOT drug and alcohol tests including pre-employment tests during the previous 3 years: the dates when I tested positive, the dates when I tested .04 or greater, the dates when I refused (including a verified adulterated or substituted result) to be tested for drugs and alcohol, and any other violations of 49 CFR part 40 and any information ${CO} and / or their authorized agents have received regarding violations of 49 CFR part 40 from my previous employers covered by DOT.`,
        `I hereby release ${employers} and their authorized agents from any and all liability of any type as a result of providing the above requested information released could affect my being employed with ${CO}`,
        'It is expressly acknowledged, understood and agreed that the information provided by the applicant regarding the applicant\'s employment during the previous 3 years in accordance with Section 391.21 (b)(10) of the Federal Motor Carrier Safety Regulations ("FMCSR") may be used, the applicant\'s prior employers may be contacted for the purpose of investigating the applicant\'s safety performance history information as required by paragraphs (d) and (e) of Section 391.23 of FMCSR. The applicant has certain due process rights under the FMCSR regarding the information received as a result of these investigations of the information.',
        `Applicant's Due Process Rights: 1) The right to review information provided by previous employers; 2) The right to have errors in the information corrected by the previous employer and for that previous employer to re-send the corrected information to ${CO}; 3) The right to have a rebuttal statement attached to the alleged erroneous information, if the previous employer and the driver cannot agree on the accuracy of the information.`,
        `Drivers who have previous DOT regulated employment history in the preceding 3 years, and wish to review previous employer provided information, must submit a written request to the Safety Compliance Manager of ${CO}, which may be done at any time, including when applying, or as late as 30 days after being employed or being notified of denial of employment. ${CO} will provide this information to the applicant within 5 business days after receiving the written request. If, however, ${CO} has not yet received the requested information from the previous employer(s), then it will provide the information to the applicant within 5 business days after it receives the requested safety performance history information. If the driver has not arranged to pick up or receive the requested records within 5 business days of ${CO} making them available, ${CO} will consider the driver to have waived the request to review the records.`,
      ],
    },
  ];
}

export const MVR_PERMISSION: LegalSection[] = [
  {
    heading: "Permission to request state driver motor vehicle record (MVR)",
    paragraphs: [
      "I understand that as a normal part of the hiring process the driving records of all prospective employees are reviewed. In addition, I understand that my driving record is subject to future, periodic reviews.",
      `By completing and signing this form I give permission to ${CO} and its insurance agent to obtain and review a copy of my driver license (MVR) record both now and in the future.`,
    ],
  },
];

export const DRUG_TEST_CONSENT: LegalSection[] = [
  {
    heading: "Request for pre-employment drug testing",
    paragraphs: [
      `I hereby consent to submit to a drug test as shall be determined by ${CO} in the selection process of applicants for employment, for the purpose of determining the drug content thereof.`,
      `I hereby release ${CO}, its employees, agents and contractors from any and all liability whatsoever arising from this request for a specimen, from the testing of the specimen and from the decisions made concerning my application of employment based upon the results of the specimen analysis.`,
      `I further agree to and hereby authorize the release of the result of said tests to ${CO}`,
      `I understand that it is the current use of illegal drugs, the use of prescription drugs in a manner other than prescribed, or a positive test for alcohol shall prohibit me from being employed at ${CO}`,
      "I further agree that a reproduced copy of this pre-employment consent and release form shall have the same force and effect as the original.",
      "I have read the foregoing and fully understand its contents. I acknowledge that my signing of this consent and release is a voluntary act on my part and that I have not been coerced into signing this document by anyone.",
    ],
  },
];

export const LICENSE_REQUIREMENTS: LegalSection[] = [
  {
    heading: "Certification of compliance with driver's license requirements",
    paragraphs: [
      "The requirements in Part 383 apply to every driver who operates in intrastate, interstate, or foreign commerce and operates a vehicle weighing 26,001 pounds or more, can transport more than 15 people, or transports hazardous materials that require placards.",
      "The requirements in Part 391 apply to every driver who operates in interstate commerce and operates a vehicle weighing 10,001 pounds or more, can transport more than 15 people, or transports hazardous materials that require placards.",
      "Parts 383 and 391 of the Federal Motor Carrier Safety Regulations contain some requirements that you as a driver must comply with. These requirements are in effect as of July 1, 1987. They are as follows:",
    ],
  },
  {
    heading: "Possess only one license",
    paragraphs: [
      "You, as a commercial vehicle driver, may not possess more than one motor vehicle operator's license. If you have more than one license, keep the license from your state of residence and return the additional license(s) to the states that issued them. Destroying a license does not close the record in the state that issued it; you must notify the state. If a multiple license has been lost, stolen, or destroyed, close your record by notifying the state of issuance that you no longer want to be licensed by that state.",
    ],
  },
  {
    heading: "Notification of license suspension, revocation or cancellation",
    paragraphs: [
      "Sections 391.5 (b)(2) and 383.33 of the Federal Motor Carrier Safety Regulations required that you notify your employer the next business day of any revocation or suspension of your driver's license. In addition, Section 383.31 requires that any time you violate a state or local traffic law (other than parking), you must report it within 30 days to your employing motor carrier, and the state that issued your license (if the violation occurs in a state other than the one which issued your license.) The notification to both the employer and state must be in writing.",
    ],
  },
];
