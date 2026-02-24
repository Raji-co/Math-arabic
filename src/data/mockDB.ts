import fs from 'fs';
import path from 'path';

export type NodeType = 'topic' | 'article' | 'video' | 'applet' | 'exercise';

export interface Node {
    id: string;
    type: NodeType;
    title: string;
    description?: string;
    content?: any; // The Serlo Editor JSON State
    url?: string;
}

export interface TaxonomyLink {
    parentId: string;
    childId: string;
}

export interface CurriculumTag {
    nodeId: string;
    country: 'SA' | 'JO' | 'EG' | 'ALL';
    grade: number;
    subject: string;
}

interface DatabaseSchema {
    nodes: Node[];
    links: TaxonomyLink[];
    tags: CurriculumTag[];
}

// Ensure this path works both in dev and prod
const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

const readDB = (): DatabaseSchema => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading db.json", error);
        return { nodes: [], links: [], tags: [] };
    }
};

const writeDB = (data: DatabaseSchema) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing db.json", error);
    }
};

// ==========================================
// ORM METHODS
// ==========================================

export const getNodes = () => readDB().nodes;
export const getLinks = () => readDB().links;
export const getTags = () => readDB().tags;

export const getNode = (id: string): Node | undefined => {
    return getNodes().find(n => n.id === id);
};

export const getChildren = (parentId: string): Node[] => {
    const db = readDB();
    const childIds = db.links.filter(link => link.parentId === parentId).map(l => l.childId);
    return db.nodes.filter(n => childIds.includes(n.id));
};

export const createNode = (node: Node, parentId?: string) => {
    const db = readDB();
    db.nodes.push(node);

    if (parentId) {
        db.links.push({ parentId, childId: node.id });
    }

    writeDB(db);
    return node;
};

// For Client-Side Mock Compatibility during page hydration
// We export constant versions of the data as read at build/start time
// NOTE: For true dynamic API routes, always use the functions above
export const MOCK_NODES = getNodes();
export const MOCK_LINKS = getLinks();
export const MOCK_CURRICULUM_TAGS = getTags();
