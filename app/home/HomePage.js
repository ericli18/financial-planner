"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';

const serverURL = process.env.REACT_APP_URL || "http://localhost:9000"

const HomePage = ({email}) => {
    const [ id, setId ] = useState(0);
    const [ groups, setGroups ] = useState([]);
    const [ personalTemplates, setPersonalTemplates ] = useState([]);
    console.log(email);

    useEffect(() => {
        const fetchData = async () => {
            var response = await fetch(serverURL+'/getUserFromEmail', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset = UTF-8"
                },
                body: JSON.stringify({email})
            });
            var res = await response.json();
            console.log(res);
            setId(res.user.id);
        }
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            var response = await fetch(serverURL+'/getAllGroupsForUser', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset = UTF-8"
                },
                body: JSON.stringify({"userId": id})
            });
            var res = await response.json();
            setGroups(res.groups);

            response = await fetch(serverURL+'/getAllPersonalTemplatesForUser', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset = UTF-8"
                },
                body: JSON.stringify({"userId": id})
            });
            res = await response.json();
            setPersonalTemplates(res.templates);
        }
        if (id !== 0) {
            fetchData();
        }
    }, [id])
    
    // console.log(groups);
    if (groups === undefined || personalTemplates === undefined) {
        return <div></div>
    }
    // console.log(id);
    // console.log(groups);
    // console.log(personalTemplates);

    return (
        <>
            {
                groups.map((group, i) => {
                    return (
                        // <div key={i}>{group.name}</div>
                        <Link href={{
                            pathname: '/dashboard',
                            query: {id: id, g: group.id}
                        }}>
                            {group.name}
                        </Link>
                    )
                })
            }
            {
                personalTemplates.map((template, i) => {
                    return (
                        <div key={i}>{template.name}</div>
                    )
                })
            }
        </>
    )
}

export default HomePage;