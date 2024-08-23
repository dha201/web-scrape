import puppeteer from 'puppeteer';

async function scrapeProfessorData(professorLink) {
    const browser = await puppeteer.launch({ headless: true });  // Set to true to run in headless mode
    const page = await browser.newPage();

  try {
    // Navigate to the professor's page
    await page.goto(professorLink, { waitUntil: 'domcontentloaded' });
    console.log(`Navigated to the professor's page: ${professorLink}`);

    // Extract all ratings and store them in a JSON object
    const ratings = await page.evaluate(() => {
      const ratingContainers = document.querySelectorAll('.Rating__RatingInfo-sc-1rhvpxz-3.kEVEoU');
      const overallRatingElement = document.querySelector('.RatingValue__Numerator-qw8sqy-2.liyUjw');
      const wouldTakeAgainElement = document.querySelectorAll('.FeedbackItem__FeedbackNumber-uof32n-1.kkESWs')[0];
      const difficultyElement = document.querySelectorAll('.FeedbackItem__FeedbackNumber-uof32n-1.kkESWs')[1];

      // Extract overall rating, would take again percentage, and difficulty
      const overallRating = overallRatingElement ? overallRatingElement.textContent.trim() : null;
      const wouldTakeAgain = wouldTakeAgainElement ? wouldTakeAgainElement.textContent.trim() : null;
      const difficulty = difficultyElement ? difficultyElement.textContent.trim() : null;

      const ratingsData = [];

      // Loop through each rating container and extract data
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

    // Output the scraped data in JSON format
    console.log(JSON.stringify(ratings, null, 2));
  } catch (error) {
    console.error('Error occurred while scraping the page:', error);
  } finally {
    await browser.close();
  }
}

// Allow the user to input the professor link
const professorLink = 'https://www.ratemyprofessors.com/professor/1903402'; // Replace this link with any other professor link
scrapeProfessorData(professorLink);
