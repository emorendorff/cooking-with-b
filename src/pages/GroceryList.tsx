import { useState } from "react";
import styled from "styled-components";
import { useGroceryListContext } from "../context/GroceryListContext";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";

const PageWrapper = styled.div`
  padding-top: 64px;
  padding-bottom: 64px;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  color: #484848;
`;

const InputSection = styled.div`
  margin-bottom: 32px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #c6b7a8;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6a0d2b;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #6a0d2b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #8a1d3b;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #c6b7a8;
  color: #484848;

  &:hover {
    background-color: #b5a699;
  }
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionHeader = styled.h2`
  font-size: 16px;
  color: #6a0d2b;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #c6b7a8;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  text-decoration: ${(props) => (props.$checked ? "line-through" : "none")};
  color: ${(props) => (props.$checked ? "#999" : "#484848")};
`;

const Checkbox = styled.input`
  margin-right: 12px;
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ItemText = styled.span`
  flex: 1;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  padding: 0 8px;

  &:hover {
    color: #6a0d2b;
  }
`;

const EmptyMessage = styled.p`
  color: #999;
  text-align: center;
  margin-top: 32px;
`;

const GroceryList = () => {
  const [inputText, setInputText] = useState("");
  const {
    manualItems,
    recipeItemsGrouped,
    addManualItems,
    toggleItem,
    removeItem,
    clearChecked,
    clearAll,
  } = useGroceryListContext();

  const handleAddItems = () => {
    const lines = inputText.split("\n");
    addManualItems(lines);
    setInputText("");
  };

  const hasItems =
    manualItems.length > 0 || Object.keys(recipeItemsGrouped).length > 0;
  const hasCheckedItems =
    manualItems.some((item) => item.checked) ||
    Object.values(recipeItemsGrouped).some((group) =>
      group.items.some((item) => item.checked)
    );

  return (
    <PageWrapper>
      <Header />
      <Container>
        <Title>Grocery List</Title>

        <InputSection>
          <TextArea
            placeholder="Add items, one per line..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <ButtonRow>
            <Button onClick={handleAddItems} disabled={!inputText.trim()}>
              Add Items
            </Button>
            {hasCheckedItems && (
              <SecondaryButton onClick={clearChecked}>
                Clear Checked
              </SecondaryButton>
            )}
            {hasItems && (
              <SecondaryButton onClick={clearAll}>Clear All</SecondaryButton>
            )}
          </ButtonRow>
        </InputSection>

        {!hasItems && (
          <EmptyMessage>
            Your grocery list is empty. Add items above or add ingredients from
            recipes.
          </EmptyMessage>
        )}

        {manualItems.length > 0 && (
          <Section>
            <SectionHeader>My Items</SectionHeader>
            <ItemList>
              {manualItems.map((item) => (
                <Item key={item.id} $checked={item.checked}>
                  <Checkbox
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id, false)}
                  />
                  <ItemText>{item.text}</ItemText>
                  <RemoveButton onClick={() => removeItem(item.id, false)}>
                    &times;
                  </RemoveButton>
                </Item>
              ))}
            </ItemList>
          </Section>
        )}

        {Object.entries(recipeItemsGrouped).map(([recipeId, group]) => (
          <Section key={recipeId}>
            <SectionHeader>From: {group.recipeName}</SectionHeader>
            <ItemList>
              {group.items.map((item) => (
                <Item key={item.id} $checked={item.checked}>
                  <Checkbox
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id, true)}
                  />
                  <ItemText>{item.text}</ItemText>
                  <RemoveButton onClick={() => removeItem(item.id, true)}>
                    &times;
                  </RemoveButton>
                </Item>
              ))}
            </ItemList>
          </Section>
        ))}
      </Container>
      <Navigation />
    </PageWrapper>
  );
};

export default GroceryList;
