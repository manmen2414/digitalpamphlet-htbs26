import { generateEventState, timeStrToMinutes } from "./eventState";

/**
 * ポップアップとイベント一覧カードで共通の本文を組み立てる。
 *
 * @param {HTMLElement} root
 * @param {{
 *   title: string,
 *   operator?: string,
 *   eventImage?: string,
 *   description?: string,
 *   times?: EventTime[],
 * }} data
 * @param {{
 *   prefix: string,
 *   showDescription?: boolean,
 *   showTimes?: boolean
 *   onGoMapClick?: (() => void)|null,
 * }} options
 */
export function appendEventContent(root, data, options) {
  const {
    prefix,
    showDescription = true,
    showTimes = true,
    onGoMapClick = null,
  } = options;

  const header = document.createElement("div");
  header.className = `${prefix}-header`;
  root.appendChild(header);
  if (data.eventImage) {
    const img = document.createElement("img");
    img.src = data.eventImage;
    img.className = `${prefix}-img`;
    header.appendChild(img);
  }

  if (onGoMapClick) {
    const goMapBtn = document.createElement("button");
    goMapBtn.className = `${prefix}-gomap`;
    goMapBtn.innerText = "マップで表示";
    goMapBtn.onclick = () => onGoMapClick();
    root.appendChild(goMapBtn);
  }

  const content = document.createElement("div");
  content.className = `${prefix}-content`;
  root.appendChild(content);

  if (data.operator) {
    const operatorElement = document.createElement("div");
    operatorElement.className = `${prefix}-operator`;
    operatorElement.innerText = data.operator;
    content.appendChild(operatorElement);
  }

  const title = document.createElement("div");
  title.className = `${prefix}-title`;
  title.innerText = data.title;
  content.appendChild(title);

  if (showDescription) {
    const description = document.createElement("div");
    description.className = `${prefix}-desc`;
    description.innerText = data.description ?? "";
    content.appendChild(description);
  }

  const times = data.times ?? [];
  if (times.length > 0 && showTimes) {
    const timesWrapper = document.createElement("div");
    timesWrapper.className = `${prefix}-times-wrapper`;
    const timesLabel = document.createElement("div");
    timesLabel.className = `${prefix}-times-label`;
    timesLabel.innerText = "時間";

    const ol = document.createElement("ol");
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    ol.append(
      ...times.map((t) => {
        const li = document.createElement("li");
        li.innerText = `${t.start} ~ ${t.end}`;
        if (timeStrToMinutes(t.start) <= currentMin) li.style.color = "#c60";
        if (timeStrToMinutes(t.end) < currentMin) li.style.color = "#aaa";
        return li;
      }),
    );

    timesWrapper.append(timesLabel, ol);
    content.appendChild(timesWrapper);
  }
}
