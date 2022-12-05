import React from 'react';

export interface History {
  id: number;
  date: Date;
  command: string;
  output: string;
}

interface Props {
  history: Array<History>;
}

export const History: React.FC<Props> = ({ history }) => {
  return (
    <>
      {history.map((entry: History, index: number) => (
        <div key={entry.command + index}>
          <div className="flex flex-row space-x-2">
            <div className="flex-shrink">
            </div>

            <div className="flex-grow">{entry.command}</div>
          </div>

          <p
            className="whitespace-pre-wrap mb-2"
            style={{ lineHeight: 'normal' }}
            dangerouslySetInnerHTML={{ __html: entry.output }}
          />
        </div>
      ))}
    </>
  );
};

export default History;
