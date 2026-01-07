const base = "https://www.internyl.org/pages/internships/";
// const base = "http://localhost:3000/pages/internships"

export const copyLinkToUserClipboard = (link: string) => {
    const fullLink = `${base}#${link}`;

    navigator.clipboard.writeText(fullLink);
}