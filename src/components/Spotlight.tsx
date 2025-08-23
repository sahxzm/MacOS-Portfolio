import React from "react";
import { format } from "date-fns";
import { apps } from "~/configs";
import type { AppsData } from "~/types";

const APPS: { [key: string]: AppsData[] } = {
  app: apps,
  portfolio: apps.filter(app => app.desktop)
};

const getRandom = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = () => {
  const timeStamp = new Date().getTime();
  const randomStamp = getRandom(0, timeStamp);
  const date = format(randomStamp, "MM/dd/yyyy");
  return date;
};

interface SpotlightProps {
  toggleSpotlight: () => void;
  openApp: (id: string) => void;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function Spotlight({
  toggleSpotlight,
  openApp,
  btnRef
}: SpotlightProps) {
  const spotlightRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [clickedID, setClickedID] = React.useState("");
  const [doubleClicked, setDoubleClicked] = React.useState<boolean>(false);

  const [searchText, setSearchText] = React.useState("");
  const [curDetails, setCurDetails] = React.useState<any>(null);

  const [appIdList, setAppIdList] = React.useState<string[]>([]);
  const [appList, setAppList] = React.useState<JSX.Element | null>(null);

  const textWhite = "text-white";
  const textBlack = "text-c-black";
  const textSelected = "bg-blue-500";

  const useClickOutside = (ref: React.RefObject<HTMLDivElement>, callback: () => void, refs: React.RefObject<HTMLDivElement>[]) => {
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  };

  useClickOutside(spotlightRef, toggleSpotlight, [btnRef]);

  React.useEffect(() => {
    updateAppList();
  }, [searchText]);

  React.useEffect(() => {
    updateCurrentDetails();
  }, [selectedIndex]);

  React.useEffect(() => {
    if (appIdList.length === 0) return;
    // find app's index given its id
    const newSelectedIndex = appIdList.findIndex((item) => {
      return item === clickedID;
    });
    // update index
    updateHighlight(selectedIndex, newSelectedIndex);
    setSelectedIndex(newSelectedIndex);
  }, [clickedID]);

  React.useEffect(() => {
    if (doubleClicked) {
      launchSelectedApp();
      setDoubleClicked(false);
    }
  }, [doubleClicked]);

  const search = (type: string) => {
    if (searchText === "") return [];

    const text = searchText.toLowerCase();
    return APPS[type].filter(
      (item: AppsData) =>
        item.title.toLowerCase().includes(text) || item.id.toLowerCase().includes(text)
    );
  };

  const handleClick = (id: string) => {
    setClickedID(id);
  };

  const handleDoubleClick = (id: string) => {
    setClickedID(id);
    setDoubleClicked(true);
  };

  const launchSelectedApp = () => {
    if (curDetails.type === "app" && !curDetails.link) {
      openApp(curDetails.id);
      toggleSpotlight();
    } else {
      window.open(curDetails.link, "_blank");
    }
  };

  const getTypeAppList = (type: string, startIndex: number) => {
    const result = search(type);
    const typeAppList = [];
    const typeAppIdList = [];

    for (const app of result) {
      const curIndex = startIndex + typeAppList.length;
      const bg = curIndex === 0 ? textSelected : "bg-transparent";
      const text = curIndex === 0 ? textWhite : textBlack;

      if (curIndex === 0) setCurrentDetailsWithType(app, type);

      typeAppList.push(
        <li
          id={`spotlight-${app.id}`}
          key={`spotlight-${app.id}`}
          className={`pr-1 h-7 w-full flex rounded ${bg} ${text} cursor-default`}
          data-app-type={type}
          onClick={() => handleClick(app.id)}
          onDoubleClick={() => handleDoubleClick(app.id)}
        >
          <div className="w-8 flex-center">
            <img w-5 src={app.img} alt={app.title} title={app.title} />
          </div>
          <div className="flex-1 hstack overflow-hidden whitespace-nowrap">
            {app.title}
          </div>
        </li>
      );
      typeAppIdList.push(app.id);
    }

    return {
      appList: typeAppList,
      appIdList: typeAppIdList
    };
  };

  const updateAppList = () => {
    const app = getTypeAppList("app", 0);
    const portfolio = getTypeAppList("portfolio", app.appIdList.length);

    const newAppIdList = [...app.appIdList, ...portfolio.appIdList];
    // don't show app details when there is no associating app
    if (newAppIdList.length === 0) setCurDetails(null);

    const newAppList = (
      <div>
        {app.appList.length !== 0 && (
          <div>
            <div className="spotlight-type">Applications</div>
            <ul className="w-full text-xs">{app.appList}</ul>
          </div>
        )}
        {portfolio.appList.length !== 0 && (
          <div>
            <div className="spotlight-type mt-1.5 before:(content-empty absolute left-0 top-0 ml-2 w-63.5 border-t border-menu)">
              Portfolio
            </div>
            <ul className="w-full text-xs">{portfolio.appList}</ul>
          </div>
        )}
      </div>
    );

    setAppIdList(newAppIdList);
    setAppList(newAppList);
  };

  const setCurrentDetailsWithType = (app: any, type: string) =>
    setCurDetails({
      ...app,
      type
    });

  const updateCurrentDetails = () => {
    if (appIdList.length === 0 || searchText === "") {
      setCurDetails(null);
      return;
    }

    const appId = appIdList[selectedIndex];
    const element = document.querySelector(`#spotlight-${appId}`) as HTMLElement;
    const type = element.dataset.appType as string;
    const app = APPS[type].find((item: AppsData) => item.id === appId);

    setCurrentDetailsWithType(app, type);
  };

  const updateHighlight = (prevIndex: number, curIndex: number) => {
    if (appIdList.length === 0) return;

    // remove highlight
    const prevAppId = appIdList[prevIndex];
    const prev = document.querySelector(`#spotlight-${prevAppId}`) as HTMLElement;
    prev.className = prev.className
      .replace(textWhite, textBlack)
      .replace(textSelected, "bg-transparent");

    // add highlight
    const curAppId = appIdList[curIndex];
    const cur = document.querySelector(`#spotlight-${curAppId}`) as HTMLElement;
    cur.className = cur.className
      .replace(textBlack, textWhite)
      .replace("bg-transparent", textSelected);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keyCode = e.key;
    const numApps = appIdList.length;

    // ----------- select next app -----------
    if (keyCode === "ArrowDown" && selectedIndex < numApps - 1) {
      updateHighlight(selectedIndex, selectedIndex + 1);
      setSelectedIndex(selectedIndex + 1);
    }
    // ----------- select previous app -----------
    else if (keyCode === "ArrowUp" && selectedIndex > 0) {
      updateHighlight(selectedIndex, selectedIndex - 1);
      setSelectedIndex(selectedIndex - 1);
    }
    // ----------- launch app -----------
    else if (keyCode === "Enter") {
      if (!curDetails) return;
      launchSelectedApp();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // update highlighted line
    updateHighlight(selectedIndex, 0);
    // current selected id go back to 0
    setSelectedIndex(0);
    // update search text and associating app list
    setSearchText(e.target.value);
  };

  return (
    <div
      className="spotlight"
      onKeyDown={handleKeyPress}
      onClick={() => inputRef.current?.focus()}
      ref={spotlightRef}
    >
      <div
        className="w-full h-12 sm:h-14 rounded-lg bg-transparent"
        grid="~ cols-8 sm:cols-11"
      >
        <div className="col-start-1 col-span-1 flex-center">
          <span className="i-bx:search ml-1 text-c-600 text-[28px]" />
        </div>
        <input
          ref={inputRef}
          className={`col-start-2 col-span-7 ${
            curDetails ? "sm:col-span-9" : "sm:col-span-10"
          } bg-transparent no-outline px-1`}
          text="c-black xl sm:2xl"
          placeholder="Spotlight Search"
          value={searchText}
          onChange={handleInputChange}
          autoFocus={true}
        />
        {curDetails && (
          <div className="hidden sm:flex col-start-11 col-span-1 flex-center">
            <img
              w-8
              src={curDetails.img}
              alt={curDetails.title}
              title={curDetails.title}
            />
          </div>
        )}
      </div>
      {searchText !== "" && (
        <div flex h-85 bg-transparent border="t menu">
          <div w="32 sm:72" border="r menu" p="x-2.5" overflow-y-scroll>
            {appList}
          </div>
          {curDetails && (
            <div className="flex-1 vstack">
              <div className="w-4/5 h-56" flex="center col" border="b menu">
                <img
                  w-32
                  src={curDetails.img}
                  alt={curDetails.title}
                  title={curDetails.title}
                />
                <div m="t-4" text="xl c-black">
                  {curDetails.title}
                </div>
                <div text="xs c-500">
                  {`Version: ${getRandom(0, 99)}.${getRandom(0, 999)}`}
                </div>
              </div>
              <div className="flex-1 hstack text-xs">
                <div w="1/2" text="right c-500">
                  <div>Kind</div>
                  <div>Size</div>
                  <div>Created</div>
                  <div>Modified</div>
                  <div>Last opened</div>
                </div>
                <div className="flex-1 pl-2 text-c-black">
                  <div>{curDetails.type === "app" ? "Application" : "Portfolio"}</div>
                  <div>{`${getRandom(0, 999)} G`}</div>
                  <div>{getRandomDate()}</div>
                  <div>{getRandomDate()}</div>
                  <div>{getRandomDate()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
