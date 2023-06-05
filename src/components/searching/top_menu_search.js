import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";

export default function SearchAppBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/blog/lists/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (event, value) => {
        setSearchQuery(value);
    };

    const handleSelectOption = (event, option) => {
        if (option && option.title !== "No results found") {
            // Navigate to the details page of the selected result
            navigate(`/blog/${option.id}`);
        }
    };

    const filterOptions = (options, state) => {
        if (state.inputValue === "") {
            // Return an empty array when input is empty to hide the options
            return [];
        } else {
            const filteredOptions = options.filter((option) => option.title.toLowerCase().includes(state.inputValue.toLowerCase()));

            if (filteredOptions.length === 0) {
                // Add a custom option for "No results found"
                filteredOptions.push({ title: "No results found" });
            }

            return filteredOptions;
        }
    };

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={searchResults}
            noOptionsText="Enter search keywords"
            getOptionLabel={(option) => (
                <div>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                        <div>{option.title}</div>
                        <figure>
                            <img src={`http://localhost:8000${option.image}`} alt={option.title} style={{ width: 30, height: 30, marginRight: 10 }} />
                        </figure>
                    </div>
                </div>
            )}
            filterOptions={filterOptions}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Search" value={searchQuery} onChange={handleInputChange} />}
            onChange={handleSelectOption}
        />
    );
}
