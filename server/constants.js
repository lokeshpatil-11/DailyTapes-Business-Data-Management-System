MODE = 'local'
GENERAL_PATH_FOR_IMAGES = '../user-dashboard/public/assets/images/';
URL_CARD_IMAGES_PATH = GENERAL_PATH_FOR_IMAGES + 'url_card';

EMAIL_SECRET = "asdf1093KMnHGcvnkljvasdu09123nlasdasdf";
MAIL_HOST = "smtp.hostinger.com";
EMAIL_USER = "ankit.kapale@reecraft.com";
EMAIL_PASS = "PJDVSX@jkfck778";

DATABASE_USER = MODE === 'local' ? 'root' : 'automanage_mysql';
DATABASE_PASS = MODE === 'local' ? '' : 'PJDVSX@jkfck778';

BASE_URL = MODE === 'local' ? 'http://localhost:3001' : "https://deilytapes.in";

module.exports = {
    URL_CARD_IMAGES_PATH,
    EMAIL_SECRET,
    MAIL_HOST,
    EMAIL_USER,
    EMAIL_PASS,
    DATABASE_USER,
    DATABASE_PASS,
    BASE_URL
};