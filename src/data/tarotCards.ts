import { TarotCard } from '../types/tarot';

export const tarotCards: TarotCard[] = [
  {
    id: 'the-fool',
    name: '愚者',
    nameEn: 'The Fool',
    description: '新的开始，冒险，自发性，纯真',
    meaning: '新的开始，冒险，自发性',
    interpretation: '象征着新的开始和无限的可能性。建议保持开放的心态，勇于尝试新事物。',
    reversedMeaning: '鲁莽，不负责任，过度冒险',
    reversedInterpretation: '提醒你需要更加谨慎，不要盲目行动。考虑决定的后果。',
    image: './images/tarot/0_OVATarot_TheFool.png'
  },
  {
    id: 'the-magician',
    name: '魔术师',
    nameEn: 'The Magician',
    description: '创造力，技能，意志力，自信',
    meaning: '创造力，技能，意志力',
    interpretation: '暗示着你拥有实现目标所需的所有工具和能力。建议相信自己，充分发挥潜能。',
    reversedMeaning: '技能未开发，自我怀疑，能力误用',
    reversedInterpretation: '建议重新审视自己的能力，避免将才能用在错误的方向。',
    image: './images/tarot/1_OVATarot_TheMagician.png'
  },
  {
    id: 'the-high-priestess',
    name: '女祭司',
    nameEn: 'The High Priestess',
    description: '直觉，神秘，内在知识，潜意识',
    meaning: '直觉，神秘，内在知识',
    interpretation: '提醒你倾听内心的声音，相信自己的直觉。可能有重要的事情即将揭示。',
    reversedMeaning: '直觉被忽视，表面判断，隐藏的真相',
    reversedInterpretation: '警示你可能忽略了重要的直觉信号，需要更深入地探索真相。',
    image: './images/tarot/2_OVATarot_TheHighPriestess.png'
  },
  {
    id: 'the-empress',
    name: '女皇',
    nameEn: 'The Empress',
    description: '丰收，母性，创造力，自然',
    meaning: '丰饶，滋养，创造力',
    interpretation: '代表着富足和创造力的时期。建议关注自己的情感需求，培养创造性表达。',
    reversedMeaning: '创造力受阻，依赖性，过度保护',
    reversedInterpretation: '提醒你需要平衡独立性和依赖性，释放被压抑的创造力。',
    image: './images/tarot/3_OVATarot_TheEmpress.png'
  },
  {
    id: 'the-emperor',
    name: '皇帝',
    nameEn: 'The Emperor',
    description: '权威，控制，领导，规则',
    meaning: '权威，控制，结构',
    interpretation: '代表着权威和控制。暗示你应该建立清晰的界限和结构，采取行动。',
    reversedMeaning: '控制过度，僵化，缺乏纪律',
    reversedInterpretation: '警告控制欲过强或权力滥用的风险。建议寻找更平衡的领导方式。',
    image: './images/tarot/4_OVATarot_TheEmperor.png'
  },
  {
    id: 'the-hierophant',
    name: '教皇',
    nameEn: 'The Hierophant',
    description: '传统，信仰，教育，规范',
    meaning: '传统，信仰，智慧',
    interpretation: '象征着遵循传统和社会规范。建议寻求指导和尊重既定的制度。',
    reversedMeaning: '挑战传统，个人信仰，不从众',
    reversedInterpretation: '鼓励你质疑传统，寻找自己的精神道路和价值观。',
    image: './images/tarot/5_OVATarot_TheHierophant.png'
  },
  {
    id: 'the-lovers',
    name: '恋人',
    nameEn: 'The Lovers',
    description: '爱情，关系，选择，和谐',
    meaning: '爱情，和谐，关系',
    interpretation: '预示着重要的关系和选择。不仅仅关于爱情，还涉及价值观的和谐。',
    reversedMeaning: '不和谐，价值观冲突，困难选择',
    reversedInterpretation: '暗示关系中的冲突或困难的选择。需要重新评估你的价值观。',
    image: './images/tarot/6_OVATarot_TheLover.png'
  },
  {
    id: 'the-chariot',
    name: '战车',
    nameEn: 'The Chariot',
    description: '胜利，决心，控制，意志力',
    meaning: '决心，胜利，克服障碍',
    interpretation: '象征着通过意志力和决心克服困难。鼓励你保持专注，不要放弃。',
    reversedMeaning: '自我怀疑，缺乏方向，挫折',
    reversedInterpretation: '警示你可能遇到阻力或缺乏明确方向。建议重新集中精力。',
    image: './images/tarot/7_OVATarot_TheChariot.png'
  },
  {
    id: 'strength',
    name: '力量',
    nameEn: 'Strength',
    description: '勇气，耐心，内在力量，自控',
    meaning: '内在力量，勇气，自信',
    interpretation: '象征着你拥有克服困难的内在力量。相信自己，保持耐心和毅力。',
    reversedMeaning: '自我怀疑，软弱，缺乏信心',
    reversedInterpretation: '建议重新找回内在力量，不要被恐惧和怀疑所困扰。',
    image: './images/tarot/8_OVATarot_Strength.png'
  },
  {
    id: 'the-hermit',
    name: '隐士',
    nameEn: 'The Hermit',
    description: '内省，寻求，孤独，指导',
    meaning: '内省，寻求真理，独处',
    interpretation: '鼓励你花时间独处和反思。寻找内在的智慧和真理。',
    reversedMeaning: '孤立，退缩，过度反思',
    reversedInterpretation: '警告过度孤立或拒绝他人帮助的风险。建议找到平衡点。',
    image: './images/tarot/9_OVATarot_TheHermit.png'
  },
  {
    id: 'wheel-of-fortune',
    name: '命运之轮',
    nameEn: 'Wheel of Fortune',
    description: '命运，转折点，机会，变化',
    meaning: '改变，机遇，命运',
    interpretation: '预示着重要的转折点即将到来。保持积极态度，准备接受改变。',
    reversedMeaning: '阻力，不良循环，抗拒改变',
    reversedInterpretation: '警示你可能陷入负面循环，需要主动打破当前局面。',
    image: './images/tarot/10_OVATarot_WheelOfFortune.png'
  },
  {
    id: 'justice',
    name: '正义',
    nameEn: 'Justice',
    description: '公正，真理，因果，平衡',
    meaning: '公平，平衡，真理',
    interpretation: '暗示着需要做出公正的决定。保持客观，权衡利弊。',
    reversedMeaning: '不公，失衡，偏见',
    reversedInterpretation: '提醒你当前的处境可能存在不公平，需要重新审视情况。',
    image: './images/tarot/11_OVATarot_Justice.png'
  },
  {
    id: 'the-hanged-man',
    name: '吊人',
    nameEn: 'The Hanged Man',
    description: '牺牲，等待，暂停，新视角',
    meaning: '牺牲，等待，新视角',
    interpretation: '建议你暂停并从新角度看问题。有时不行动也是一种行动。',
    reversedMeaning: '拖延，抵抗，不必要的牺牲',
    reversedInterpretation: '警告不必要的自我牺牲或拖延。可能是时候采取行动了。',
    image: './images/tarot/12_OVATarot_TheHangedMan.png'
  },
  {
    id: 'death',
    name: '死神',
    nameEn: 'Death',
    description: '结束，转变，释放，重生',
    meaning: '转变，结束，新的开始',
    interpretation: '象征着重大转变和结束，但也预示着新生。接受变化，放下过去。',
    reversedMeaning: '抗拒变化，停滞，拒绝放手',
    reversedInterpretation: '提醒你不要抗拒必要的结束和变化。拒绝改变只会延长痛苦。',
    image: './images/tarot/13_OVATarot_Death.png'
  },
  {
    id: 'temperance',
    name: '节制',
    nameEn: 'Temperance',
    description: '平衡，和谐，适度，调和',
    meaning: '平衡，调和，耐心',
    interpretation: '鼓励你寻找生活中的平衡和温和。避免极端，培养耐心和适度。',
    reversedMeaning: '不平衡，过度，冲突',
    reversedInterpretation: '警告生活中的不平衡或极端行为。建议重新调整以恢复和谐。',
    image: './images/tarot/14_OVATarot_Temperance.png'
  },
  {
    id: 'the-devil',
    name: '恶魔',
    nameEn: 'The Devil',
    description: '束缚，欲望，物质主义，阴影面',
    meaning: '束缚，欲望，物质主义',
    interpretation: '暗示你可能陷入不健康的模式或关系。提醒你面对自己的阴影面。',
    reversedMeaning: '释放，觉醒，打破束缚',
    reversedInterpretation: '预示着脱离束缚和不健康模式的机会。鼓励重获自由。',
    image: './images/tarot/15_OVATarot_TheDevil.png'
  },
  {
    id: 'the-tower',
    name: '塔',
    nameEn: 'The Tower',
    description: '灾难，突变，启示，解放',
    meaning: '突变，冲击，启示',
    interpretation: '预警突如其来的变化和动荡。虽然可能令人不适，但常带来必要的觉醒。',
    reversedMeaning: '避免灾难，渐进式改变，恐惧变化',
    reversedInterpretation: '可能表示你正在避免必要的改变。建议拥抱转变，即使它令人不安。',
    image: './images/tarot/16_OVATarot_TheTower.png'
  },
  {
    id: 'the-star',
    name: '星星',
    nameEn: 'The Star',
    description: '希望，启发，宁静，更新',
    meaning: '希望，启发，灵感',
    interpretation: '预示着光明的未来和新的希望。保持乐观，相信美好即将到来。',
    reversedMeaning: '失望，消极，丧失信心',
    reversedInterpretation: '提醒你不要被当前的困境所困扰，重新找回希望和信心。',
    image: './images/tarot/17_OVATarot_TheStar.png'
  },
  {
    id: 'the-moon',
    name: '月亮',
    nameEn: 'The Moon',
    description: '直觉，梦境，潜意识，幻觉',
    meaning: '直觉，不确定性，幻觉',
    interpretation: '象征着不确定性和幻觉。鼓励你信任直觉，面对恐惧。',
    reversedMeaning: '自我欺骗，隐藏的真相浮现，恐惧消散',
    reversedInterpretation: '可能表示隐藏的真相即将浮出水面，或混乱状态正在消退。',
    image: './images/tarot/18_OVATarot_TheMoon.png'
  },
  {
    id: 'the-sun',
    name: '太阳',
    nameEn: 'The Sun',
    description: '快乐，成功，满足，清晰',
    meaning: '快乐，活力，成功',
    interpretation: '象征着成功和快乐。预示着积极的发展和满足感。',
    reversedMeaning: '挫折，压抑的快乐，过度乐观',
    reversedInterpretation: '提醒你不要被表面的成功所蒙蔽，或过度乐观而忽视实际问题。',
    image: './images/tarot/19_OVATarot_TheSun.png'
  },
  {
    id: 'judgement',
    name: '审判',
    nameEn: 'Judgement',
    description: '重生，唤醒，觉醒，反思',
    meaning: '反思，重生，唤醒',
    interpretation: '提示你进行自我反思和评估。预示着重生和重要的人生转变。',
    reversedMeaning: '自我怀疑，拒绝反思，错失机会',
    reversedInterpretation: '警告拒绝自我反思或错过重要觉醒机会的风险。',
    image: './images/tarot/20_OVATarot_Judgement.png'
  },
  {
    id: 'the-world',
    name: '世界',
    nameEn: 'The World',
    description: '完成，成就，完整，整合',
    meaning: '完成，成就，完整',
    interpretation: '象征着圆满的结束和成就。预示着重要周期的完成和新旅程的开始。',
    reversedMeaning: '未完成，延迟，不愿结束',
    reversedInterpretation: '提醒你可能存在未完成的事务，或难以接受某个阶段的结束。',
    image: './images/tarot/21_OVATarot_TheWorld.png'
  }
]; 