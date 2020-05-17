/**
 * Create random data for testing utilities and APIs
 * @author Peter Kappelt
 */


const randomstring = require("randomstring");

class DataSeeder {
    /**
     * Returns a random integer that imitates an id
     */
    static randomId() {
        return Math.floor(Math.random() * 10000);
    }

    /**
     * Generate a random character string
     * @param {*} length Length of string to be generated 
     */
    static randomString(length){
        return randomstring.generate(length);
    }

    /**
     * Generate a random string imitating a name
     */
    static randomName(){
        return DataSeeder.randomString(10);
    }

    /**
     * Generate a random string imitating a mail address
     */
    static randomMail(){
        return DataSeeder.randomString(10) + "@" + DataSeeder.randomString(7) + ".com";
    }

    /** 
     * generate a random bool (true/ false) 
     */
    static randomBool(){
        return (Math.random() > 0.5) ? true:false;
    }

    /**
     * generate a random iso formatted timestamp
     */
    static randomIsoTimestamp(){
        let randomTimestamp = Math.random() * (new Date().getTime());
        let randomDate = new Date();
        randomDate.setTime(randomTimestamp);
        return randomDate.toISOString();
    }
}

module.exports = DataSeeder;
