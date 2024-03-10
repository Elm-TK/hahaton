import LogoIcon from "./LogoIcon.tsx";

const Header = () => {
    return (
        <header className="bg-white shadow-xl p-2">
            <div className="relative flex ms-24 h-16 items-center ">
                <LogoIcon/>
            </div>
        </header>
    );
};

export default Header;
