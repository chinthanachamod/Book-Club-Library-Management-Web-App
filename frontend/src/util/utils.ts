import type {RefObject} from "react";

// Filters an array based on an input string (case-insensitive).
export const filterItems = (items: string[], input: string): string[] => {
    return items.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
    );
};

// Handles keyboard navigation for dropdowns.
export const handleDropdownKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    {
        visible,
        setVisible,
        filteredItems,
        selectedIndex,
        setSelectedIndex,
        setInputValue,
        inputRef,
    }: {
        visible: boolean;
        setVisible: (visible: boolean) => void;
        filteredItems: string[];
        selectedIndex: number;
        setSelectedIndex: (index: (prev: any) => any) => void;
        setInputValue: (value: string) => void;
        inputRef: RefObject<HTMLInputElement | null>;
    }
) => {
    if (!visible) setVisible(true);

    if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
            prev + 1 >= filteredItems.length ? 0 : prev + 1
        );
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
            prev === 0 ? filteredItems.length - 1 : prev - 1);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
            setInputValue(filteredItems[selectedIndex]);
        }
        setVisible(false);
        inputRef.current?.blur();
    } else if (e.key === "Escape") {
        setVisible(false);
    }
};

// Handles clicking on an item from the dropdown.
export const handleDropdownClick = (
    item: string,
    {
        setInputValue,
        setVisible,
        inputRef,
    }: {
        setInputValue: (value: string) => void;
        setVisible: (visible: boolean) => void;
        inputRef: RefObject<HTMLInputElement | null>;
    }
) => {
    setInputValue(item);
    setVisible(false);
    inputRef.current?.focus();
};

// Hook-style logic to close dropdowns when clicking outside.
export const setupClickOutsideListener = (
    dropdownRef: RefObject<HTMLElement | null>,
    inputRef: RefObject<HTMLElement | null>,
    setVisible: (visible: boolean) => void
) => {
    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            inputRef.current &&
            !inputRef.current.contains(event.target as Node)
        ) {
            setVisible(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
};