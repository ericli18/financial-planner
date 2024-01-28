import { useEffect, useState } from 'react';

const serverURL = process.env.REACT_APP_URL || "http://localhost:9000"

const HomePage = ({email}) => {
    const [ id, setId ] = useState(0);
    const [ groups, setGroups ] = useState([]);
    const [ personalTemplates, setPersonalTemplates ] = useState([]);

    useEffect(() => {
        fetch(serverURL+'/getAllGroupsForUser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset = UTF-8"
            },
            body: JSON.stringify({"userId": id})
        });
    }, [])
}