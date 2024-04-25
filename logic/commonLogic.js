import Filter from 'bad-words';

export const filter = new Filter();
export const veryBadWords = [
    "verybadword",
    "badword"
];

export const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export const defaultProfilePicture = "https://firebasestorage.googleapis.com/v0/b/mc-chat-b6bef.appspot.com/o/profilePictures%2Fdefault.jpeg?alt=media&token=7ea7f74c-faab-476a-bff6-84746602095c";

export const getChatId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    const chatId = sortedIds.join('-');
    return chatId;
}

export const formatDate = date => {
    var day = date.getDate();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = monthNames[date.getMonth()];

    var formattedDate = day + ' ' + month;
    return formattedDate;
}

export const normalizeDate = (timestamp) => {
    if (!timestamp) {
        return '';
    }

    if (timestamp.toDate) {
        return timestamp.toDate().toISOString();
    }

    if (timestamp instanceof Date) {
        return timestamp.toISOString();
    }

    if (typeof timestamp === 'number') {
        return new Date(timestamp).toISOString();
    }

    if (typeof timestamp === 'string') {
        return new Date(timestamp).toISOString();
    }

    if (typeof timestamp === 'object') {
        return new Date(timestamp).toISOString();
    }

    return '';
};

export const generateYears = (startYear, endYear) => {
    let years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year.toString());
    }
    return years;
};

export const currentYear = new Date().getFullYear();

export const mcMajors = [
    "Accounting",
    "Biology",
    "Business",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Science",
    "Digital Media Art",
    "Economics",
    "Electrical Engineering",
    "English",
    "Finance",
    "History",
    "Management",
    "Marketing",
    "Mathematics",
    "Mechanical Engineering",
    "Philosophy",
    "Physics",
    "Political Science",
    "Psychology",
    "Sociology",
    "Software Engineering",
    "Undergraduate"
];

export const mcDepts = [
    "Accounting, Business Analytics, CIS & Law",
    "Biological and Chemical Sciences",
    "Chemical Engineering",
    "Civil & Environmental Engineering",
    "Communication, Sound and Media Arts",
    "Computer Science",
    "Department of Air & Space Studies",
    "Economics & Finance",
    "Education",
    "Electrical & Computer Engineering",
    "English, World Languages and Literatures",
    "History, Political Studies and International Studies",
    "Management & Marketing",
    "Mathematics and Physics",
    "Mechanical Engineering",
    "Organizational Leadership",
    "Radiation Therapy",
    "Religion and Philosophy",
    "Social and Behavioral Sciences"
];

export const mcTitles = [
    "Department Chair",
    "Professor",
    "Assistant Professor",
    "Associate Professor",
    "Adjunct"
];