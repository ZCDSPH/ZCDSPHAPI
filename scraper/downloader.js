const nexo = require("nexo-aio-downloader");

exports.config = {
    name: 'downloader',
    author: 'Marjhun Baylon',
    description: 'Downloads media from various platforms like Twitter, Instagram, Facebook, etc.',
    category: 'tools',
    link: ['/downloader']
};
const supportedPlatforms = {
    twitter: ["twitter.com", "x.com", "www.twitter.com", "www.x.com"],
    instagram: ["instagram.com", "www.instagram.com"],
    facebook: ["facebook.com", "www.facebook.com", "facebook.com/share/v/", "www.facebook.com/share/v/"],
    tiktok: ["tiktok.com", "vt.tiktok.com", "www.tiktok.com", "www.vt.tiktok.com"],
    "google-drive": ["drive.google.com", "www.drive.google.com"],
    sfile: ["sfile.mobi", "www.sfile.mobi"]
};

exports.initialize = async function ({ req, res }) {
    try {
        let url = req.query.url;

        if (!url) {
            return res.status(400).json({ error: "Please add ?url=media_url_here" });
        }

        
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
        const normalizedUrl = url.replace(/^https?:\/\/(www\.)?/, 'https://');

        let platform = Object.keys(supportedPlatforms).find(key => 
            supportedPlatforms[key].some(pattern => normalizedUrl.includes(pattern.replace("www.", "")))
        );

        if (!platform) {
            return res.status(400).json({ error: "Unsupported URL" });
        }

        let result;
        switch (platform) {
            case 'twitter':
                result = await nexo.twitter(url);
                break;
            case 'instagram':
                result = await nexo.instagram(url);
                break;
            case 'facebook':
                if (url.includes('/share/v/')) {
                    
                    result = await nexo.facebook(url);
                } else {
                    result = await nexo.facebook(url);
                }
                break;
            case 'tiktok':
                result = await nexo.tiktok(url);
                break;
            case 'google-drive':
                result = await nexo.googleDrive(url);
                break;
            case 'sfile':
                result = await nexo.sfile(url);
                break;
            default:
                return res.status(400).json({ error: "Unsupported URL" });
        }

        res.json({ content: result });
    } catch (error) {
        console.error("Error downloading media:", error);
        res.status(500).json({ error: "Failed to download media" });
    }
};
