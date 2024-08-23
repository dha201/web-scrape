/* import puppeteer from 'puppeteer';

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });  // Set to true to run in headless mode
  const page = await browser.newPage();

  // Step 1: Navigate to the homepage
  await page.goto('https://www.ratemyprofessors.com/', {
    waitUntil: 'domcontentloaded',  // Wait until only the DOM is loaded
    timeout: 5000  // Increase timeout to 60 seconds
  });
  // Step 2: Handle the cookie consent modal
  try {
    const closeButtonSelector = '.fyxlwo__content .CCPAModal__StyledCloseButton-sc-10x9kq-2';
    const closeButton = await page.$(closeButtonSelector);

    if (closeButton) {
      await closeButton.click();
      console.log('Closing cookie consent modal ...');
    } else {
      console.log('Cookie consent modal not found.');
    }
  } catch (error) {
    console.log('Error occurred while handling the cookie consent modal:', error);
  }

  console.log('Closed the cookie consent modal successfully!');

  // Step 3: Wait for the toggle button to appear and click it
  await page.waitForSelector('.HomepageHero__HeroToggle-rvkinu-3.eOMiLm');
  await page.click('.HomepageHero__HeroToggle-rvkinu-3.eOMiLm');

  // Step 4: Wait for the search input to appear, type professor name, and press Enter
  await page.waitForSelector('input[placeholder="Professor name"]');
  await page.type('input[placeholder="Professor name"]', 'John Otten');
  await page.keyboard.press('Enter');

  ///////////////////
  
  // Step 5: Wait for the search results page to load
  // await page.waitForNavigation(); // Since the content is static, we do not need to wait for navigation. We can simply wait for the necessary elements to appear.
  await page.waitForSelector('.TeacherCard__StyledTeacherCard-syjs0d-0');

  // Step 6: Find the CardSchool_School and CardName that match, then click the associated TeacherCard
  const professorDetails = await page.evaluate(() => {
    const teacherCards = document.querySelectorAll('.TeacherCard__StyledTeacherCard-syjs0d-0');
    const targetProfessorName = 'John Otten';
    const targetSchoolName = 'George Mason University';
    const professorLinks = [];

    teacherCards.forEach(card => {
      const professorNameElement = card.querySelector('.CardName__StyledCardName-sc-1gyrgim-0');
      const schoolElement = card.querySelector('.CardSchool__School-sc-19lmz2k-1');
      
      if (
        professorNameElement && 
        professorNameElement.textContent.trim() === targetProfessorName &&
        schoolElement && 
        schoolElement.textContent.trim() === targetSchoolName
      ) {
        const href = card.getAttribute('href');
        if (href) {
          professorLinks.push(href);
        }
      }
    });
    return professorLinks;
  });

  if (professorDetails && professorDetails.length > 0) {
    for (const professorLink of professorDetails) {
      await page.goto(`https://www.ratemyprofessors.com${professorLink}`);
      console.log(`Navigated to the professor's page: ${professorLink}`);

      // Step 7: Extract all ratings and store them in a JSON object, along with rating, would take again, and difficulty
      const ratings = await page.evaluate(() => {
        const ratingContainers = document.querySelectorAll('.Rating__RatingInfo-sc-1rhvpxz-3.kEVEoU');
        const overallRatingElement = document.querySelector('.RatingValue__Numerator-qw8sqy-2.liyUjw');
        const wouldTakeAgainElement = document.querySelectorAll('.FeedbackItem__FeedbackNumber-uof32n-1.kkESWs')[0];
        const difficultyElement = document.querySelectorAll('.FeedbackItem__FeedbackNumber-uof32n-1.kkESWs')[1];

        const overallRating = overallRatingElement ? overallRatingElement.textContent.trim() : null;
        const wouldTakeAgain = wouldTakeAgainElement ? wouldTakeAgainElement.textContent.trim() : null;
        const difficulty = difficultyElement ? difficultyElement.textContent.trim() : null;

        const ratingsData = [];

        ratingContainers.forEach((container, index) => {
          const attendanceElement = container.querySelector('.CourseMeta__StyledCourseMeta-x344ms-0.fPJDHT .MetaItem__StyledMetaItem-y0ixml-0.LXClX span');
          const attendance = attendanceElement ? attendanceElement.textContent.trim() : null;

          const commentsElement = container.querySelector('.Comments__StyledComments-dzzyvm-0.gRjWel');
          const comments = commentsElement ? commentsElement.textContent.trim() : null;

          ratingsData.push({
            comment_number: index + 1,
            attendance: attendance,
            comments: comments
          });
        });

        return {
          overallRating,
          wouldTakeAgain,
          difficulty,
          ratingsData
        };
      });

      console.log(JSON.stringify(ratings, null, 2));
    }
  } else {
    console.log('No professor from George Mason University named John Otten found.');
  }

  // Step 8: Close the browser
  await browser.close();
};

scrape();
 */