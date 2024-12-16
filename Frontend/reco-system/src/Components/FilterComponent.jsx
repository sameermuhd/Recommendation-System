import React, { useState, useEffect } from "react";
import "./FilterComponent.css"; // Import the CSS file

const FilterComponent = ({ onFilterSelect }) => {
    const [filters, setFilters] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("");

    // Fetch filters from the API
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/filters"
                );
                const data = await response.json();
                setFilters(data.filters); // Set available filters
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };

        fetchFilters();
    }, []);

    // Handle filter selection
    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        onFilterSelect(filter); // Inform the parent component about the selected filter
    };

    // Handle clearing the filter
    const handleClearFilter = () => {
        setSelectedFilter(""); // Clear the selected filter in local state
        onFilterSelect(""); // Notify parent component to remove the filter
    };

    return (
        <div className="divClass">
            {filters.map((filter, index) => (
                <button
                    key={index}
                    onClick={() => handleFilterClick(filter)}
                    className={`filter-btn ${
                        filter === selectedFilter ? "active" : ""
                    }`} // Apply active class
                >
                    {filter}
                </button>
            ))}

            {/* Clear filter button */}
            <button
                onClick={handleClearFilter}
                className="clear-btn"
                disabled={!selectedFilter} // Disable the button if no filter is selected
            >
                Clear Filter
            </button>
        </div>
    );
};

export default FilterComponent;
