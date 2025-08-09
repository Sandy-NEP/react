import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { applyCategoryFilter } from "../../redux/category/categoryPaginationSlice";
import { items as allItems } from "../../assets/assets";

const categories = [
  "All",
  "Seasonal Collection",
  "Occasion Based",
  "Style Based",
  "Special Collection",
  "Casual Wears",
  "Sports & Activewear",
  "Traditional Wear",
];

export default function SearchBar() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Map display categories to item categories
  const categoryMap = {
    "All": null,
    "Seasonal Collection": "seasonal",
    "Occasion Based": "occasion",
    "Style Based": "style",
    "Special Collection": "special",
    "Casual Wears": "casual",
    "Sports & Activewear": "sports",
    "Traditional Wear": "traditional",
  };

  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = allItems
      .filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.desc.toLowerCase().includes(searchLower)
        );
      })
      .slice(0, 5); // Limit to 5 suggestions

    setSuggestions(filteredSuggestions);
  }, [searchQuery]);

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim() === "" && selectedCategory === "All") {
      dispatch(applyCategoryFilter({ items: allItems, category: null }));
    } else {
      const filteredItems = allItems.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          searchQuery.trim() === "" ||
          item.name.toLowerCase().includes(searchLower) ||
          item.desc.toLowerCase().includes(searchLower);
        const matchesCategory =
          selectedCategory === "All" ||
          item.category === categoryMap[selectedCategory];
        return matchesSearch && matchesCategory;
      });

      dispatch(
        applyCategoryFilter({
          items: filteredItems,
          category: selectedCategory === "All" ? null : categoryMap[selectedCategory],
        })
      );
    }
    setSuggestions([]);
    navigate(`/shop?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (item) => {
    setSearchQuery(item.name);
    setSuggestions([]);
    dispatch(
      applyCategoryFilter({
        items: [item],
        category: item.category,
      })
    );
    navigate(`/item/${item._id}`);
  };

  return (
    <div className="flex items-center w-full rounded-[5px] overflow-hidden" ref={dropdownRef}>
      {/* Dropdown */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center px-4 py-3 bg-[#767676] text-white text-sm font-medium hover:bg-[#7A7A7A] focus:outline-none h-full rounded-bl-[5px] rounded-tl-[5px] whitespace-nowrap"
        >
          {selectedCategory}
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
        {isDropdownOpen && (
          <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search your dress here....."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full min-w-0 bg-[#E0D7CC] px-4 py-[9px] placeholder:text-sm text-[#2a2a2a] placeholder-[#7a7a7a] focus:outline-none"
        />
        {suggestions.length > 0 && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
            {suggestions.map((item) => (
              <button
                key={item._id}
                onClick={() => handleSuggestionClick(item)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.name} - {item.desc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="flex-shrink-0 px-4 py-3 bg-[#B8A38A] hover:bg-[#a28d73] h-full rounded-br-[5px] rounded-tr-[5px]"
      >
        <Search className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}